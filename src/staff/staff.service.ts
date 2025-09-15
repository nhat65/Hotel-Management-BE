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
import { Not, Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
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
          message:
            cachedStaffs.length > 0
              ? 'Get all staffs from cache successfully!'
              : 'No staffs found in cache',
          data: cachedStaffs,
        };
      }

      const staffs = await this.staffRepository.find({
        select: ['id', 'fullName', 'dayOfBirth', 'phoneNumber', 'position'],
      });
      await this.cacheManager.set(CACHE_KEY_ALL_STAFF, staffs, CACHE_TTL);

      return {
        status: true,
        message:
          staffs.length > 0
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
        select: [
          'id',
          'fullName',
          'phoneNumber',
          'avatarUrl',
          'address',
          'dayOfBirth',
          'position',
          'email',
          'createdAt',
        ],
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
        ? `/public/uploads/staffs/${file.filename}`
        : '';

      const newStaffPayload = {
        ...createStaffDto,
        createdBy: adminId,
      };
      const newStaff = await this.staffRepository.save(newStaffPayload);
      console.log(newStaffPayload);
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
      throw new BadRequestException('Cannot get staff profile');
    }
  }
}
