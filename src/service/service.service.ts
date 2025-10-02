import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_KEY_SERVICES, CACHE_TTL } from 'src/constants/cache';
import { Service } from 'src/entities/service.entity';
import { Staff } from 'src/entities/staff.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { BookingService } from 'src/entities/booking-service.entity';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(BookingService)
    private readonly bookingServiceRepository: Repository<BookingService>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getServices() {
    try {
      const cachedServices =
        await this.cacheManager.get<Service[]>(CACHE_KEY_SERVICES);
      if (cachedServices) {
        return {
          status: true,
          message: cachedServices.length
            ? `Get services from cache successfully!`
            : 'No services found',
          data: cachedServices,
        };
      }

      const services = await this.serviceRepository.find();
      await this.cacheManager.set(CACHE_KEY_SERVICES, services, CACHE_TTL);
      return {
        status: true,
        message: services.length
          ? `Get services successfully!`
          : 'No services found',
        data: services,
      };
    } catch (error) {
      this.logger.error(`Get services error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get services');
    }
  }

  async create(createServiceDto: CreateServiceDto, staffId: string) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingService = await this.serviceRepository.findOne({
        where: { name: createServiceDto.name },
      });
      if (existingService) {
        throw new ConflictException('This service already existed');
      }

      const result = await this.serviceRepository.save(createServiceDto);
      return {
        status: true,
        message: 'Create service successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Create services error: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create service');
    }
  }

  async update(
    updateServiceDto: UpdateServiceDto,
    staffId: string,
    serviceId: string,
  ) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingService = await this.serviceRepository.findOne({
        where: { id: serviceId },
      });
      if (!existingService) {
        throw new NotFoundException('Service not found');
      }

      const duplicateService = await this.serviceRepository.exists({
        where: { name: updateServiceDto.name },
      });
      if (duplicateService) {
        throw new NotFoundException('Service name already existed');
      }

      const result = await this.serviceRepository.save({
        ...existingService,
        ...updateServiceDto,
      });
      return {
        status: true,
        message: 'Update service successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Update services error: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot update service');
    }
  }

  async delete(serviceId: string, staffId: string) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingService = await this.serviceRepository.findOne({
        where: { id: serviceId },
      });
      if (!existingService) {
        throw new NotFoundException('Service not found');
      }

      const bookedService = await this.bookingServiceRepository.find({
        where: { serviceId },
      });
      if (bookedService.length) {
        throw new ConflictException(
          'Cannot delete because this service is being booking',
        );
      }

      await this.serviceRepository.delete(serviceId);
      return {
        status: true,
        message: 'Delete service successfully',
      };
    } catch (error) {
      this.logger.error(`Delete services error: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot delete service');
    }
  }
}
