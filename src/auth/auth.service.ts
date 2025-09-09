import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AccountRole } from 'src/constants/enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      ip_address: request.ip,
      user_agent: request.headers['user-agent'] || 'unknown',
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
