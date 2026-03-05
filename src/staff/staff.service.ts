import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CACHE_KEY_ALL_STAFF,
  CACHE_KEY_STAFF_PROFILE,
  CACHE_TTL,
} from 'src/constants/cache';
import { Staff } from 'src/entities/staff.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Account } from 'src/entities/account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { UpdateStaffDto } from './dto/update.staff.dto';
import { UploadFolder } from 'src/constants/upload.constants';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAll() {
    try {
      const cachedStaffs =
        await this.cacheManager.get<Staff[]>(CACHE_KEY_ALL_STAFF);
      if (cachedStaffs) {
        return {
          status: true,
          message: cachedStaffs.length
            ? 'Get all staffs from cache successfully!'
            : 'No staffs found in cache',
          data: cachedStaffs,
        };
      }

      const staffs = await this.staffRepository.find();
      await this.cacheManager.set(CACHE_KEY_ALL_STAFF, staffs, CACHE_TTL);
      return {
        status: true,
        message: staffs.length
          ? 'Get all staffs from cache successfully!'
          : 'No staffs found in cache',
        data: staffs,
      };
    } catch (error) {
      this.logger.error(`Get all staff error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get staff list');
    }
  }

  async getProfile(staffId: string) {
    try {
      const cachedProfile = await this.cacheManager.get<Staff>(
        CACHE_KEY_STAFF_PROFILE + staffId,
      );
      if (cachedProfile) {
        return {
          status: true,
          message: 'Get staff profile from cache successfully',
          data: cachedProfile,
        };
      }

      const profile = await this.staffRepository.findOne({
        where: { id: staffId },
      });
      if (!profile) {
        throw new NotFoundException('Staff not found');
      }
      await this.cacheManager.set(
        CACHE_KEY_STAFF_PROFILE + staffId,
        profile,
        CACHE_TTL,
      );

      return {
        status: true,
        message: 'Get staff profile successfully',
        data: profile,
      };
    } catch (error) {
      this.logger.error(
        'Get staff profile error: ' + error.message,
        error.stack,
      );
    }
  }

  async createStaff(
    createStaffDto: CreateStaffDto,
    adminId: string,
    file: Express.Multer.File,
  ) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: adminId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Admin not found');
      }

      createStaffDto.avatarUrl = file
        ? `/public/uploads/${UploadFolder.STAFFS}/${file.filename}`
        : '';

      const newStaffPayload = {
        ...createStaffDto,
        createdBy: adminId,
      };
      const newStaff = await this.staffRepository.save(newStaffPayload);
      return {
        status: true,
        message: 'Create staff successfully',
        data: newStaff,
      };
    } catch (error) {
      this.logger.error(`Create staff error:${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create staff');
    }
  }

  async updateStaff(
    updateStaffDto: UpdateStaffDto,
    updatedBy: string,
    file: Express.Multer.File,
  ) {
    try {
      if (updatedBy !== updateStaffDto.id) {
        const existingAdmin = await this.staffRepository.exists({
          where: { id: updatedBy },
        });
        if (!existingAdmin) {
          throw new NotFoundException('Admin not found');
        }
      }

      const existingStaff = await this.staffRepository.exists({
        where: { id: updateStaffDto.id },
      });
      if (!existingStaff) {
        throw new NotFoundException('Admin not found');
      }

      updateStaffDto.avatarUrl = file
        ? `/public/uploads/staffs/${file.filename}`
        : '';
      const updateStaffPayload = {
        ...updateStaffDto,
        updatedBy: updatedBy,
      };
      const newStaff = await this.staffRepository.save(updateStaffPayload);
      return {
        status: true,
        message: 'Update staff successfully',
        data: newStaff,
      };
    } catch (error) {
      this.logger.error(`Update staff error:${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot update staff');
    }
  }

  async deleteStaff(staffId: string) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const staffRepo = transactionalEntityManager.getRepository(Staff);
          const existingStaff = await staffRepo.findOne({
            where: { id: staffId },
            select: ['id'],
          });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          const existingAccount = await transactionalEntityManager
            .getRepository(Account)
            .findOne({
              where: { staffId: existingStaff.id },
              select: ['id'],
            });
          if (existingAccount) {
            const tokenRepo =
              transactionalEntityManager.getRepository(RefreshToken);
            await tokenRepo.update(
              {
                accountId: existingAccount.id,
                isRevoked: false,
              },
              {
                isRevoked: true,
              },
            );
          }

          const result = await staffRepo.softDelete({ id: staffId });
          if (!result.affected) {
            throw new NotFoundException('Staff not found or already deleted');
          }
          return {
            status: true,
            message: 'Delete staff successfully',
          };
        },
      );
    } catch (error) {
      this.logger.error(`Delete staff error:${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot delete staff');
    }
  }
}
