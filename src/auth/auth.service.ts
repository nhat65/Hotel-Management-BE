import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { DataSource, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountRole } from 'src/constants/enum';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { Staff } from 'src/entities/staff.entity';
import type { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async login(loginDto: LoginDto, request: Request) {
    try {
      const { username, password } = loginDto;
      const account = await this.accountRepository.findOne({
        where: { username },
        select: ['id', 'username', 'password', 'role'],
      });
      if (!account) {
        throw new UnauthorizedException('Invalid username!');
      }

      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password!');
      }

      const payload = {
        id: account.id,
        username: account.username,
        role: account.role,
      };
      const result = await this.generateTokens(payload, request);
      return {
        status: true,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`, error.stack);
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Login failed');
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, password, confirmPassword, role, staffId } = registerDto;
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password must match confirmation password',
      );
    }
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const accountRepo = transactionalEntityManager.getRepository(Account);
          const existingAccount = await accountRepo.exists({
            where: { username },
          });
          if (existingAccount) {
            throw new ConflictException(`Username has been used`);
          }

          const existingStaff = await transactionalEntityManager
            .getRepository(Staff)
            .exists({
              where: { id: staffId },
            });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const newAccount = accountRepo.create({
            username,
            password: hashedPassword,
            role,
            staffId,
          });
          await accountRepo.save(newAccount);

          return {
            status: true,
            message: 'Register successfully.',
          };
        },
      );
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async logout(refreshToken: string) {
    try {
      const tokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
      });
      await this.refreshTokenRepository.save({...tokenRecord, ...{
        token: refreshToken,
        isRevoked: true,
      }});

      return {
        status: true,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  async generateTokens(
    payload: { id: string; username: string; role: AccountRole },
    request: Request,
  ) {
    const accessToken = await this.generateAccessToken(
      payload.id,
      payload.username,
      payload.role,
    );
    const refreshToken = await this.generateRefreshToken(
      payload.id,
      payload.username,
      payload.role,
    );
    const newRefreshToken = {
      accountId: payload.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] || 'unknown',
    };
    await this.refreshTokenRepository.save(newRefreshToken);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(
    id: string,
    username: string,
    role: AccountRole,
  ): Promise<string> {
    const payload = {
      id,
      username,
      role,
      type: 'access',
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async generateRefreshToken(
    id: string,
    username: string,
    role: AccountRole,
  ): Promise<string> {
    const payload = {
      id,
      username,
      role,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as { id: string; username: string; role: AccountRole; type: string };

      const refreshTokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
        select: ['token'],
      });
      if (!refreshTokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.generateAccessToken(
        payload.id,
        payload.username,
        payload.role,
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
