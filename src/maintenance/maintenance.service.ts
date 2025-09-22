import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentMaintenance } from 'src/entities/equipment-maintenance.entity';
import { Staff } from 'src/entities/staff.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { RoomEquipment } from 'src/entities/room-equipment.entity';
import { Room } from 'src/entities/room.entity';
import { EquipmentStatus, RoomStatus } from 'src/constants/enum';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);
  constructor(
    @InjectRepository(EquipmentMaintenance)
    private readonly maintenanceRepository: Repository<EquipmentMaintenance>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(RoomEquipment)
    private readonly roomEquipmentRepository: Repository<RoomEquipment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createMaintenanceDto: CreateMaintenanceDto, adminId: string) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const staffRepo = transactionalEntityManager.getRepository(Staff);
          const existingAdmin = await staffRepo.exists({
            where: { id: adminId },
          });
          if (!existingAdmin) {
            throw new NotFoundException('Admin not found');
          }

          const maintenanceRepo =
            transactionalEntityManager.getRepository(EquipmentMaintenance);
          const existingMaintenance = await maintenanceRepo.exists({
            where: {
              staffId: createMaintenanceDto.staffId,
              hotelEquipmentId: createMaintenanceDto.hotelEquipmentId,
            },
          });
          if (existingMaintenance) {
            throw new ConflictException(
              'The device is under maintenance. No more duplicate requests can be created.',
            );
          }

          const existingStaff = await staffRepo.exists({
            where: { id: createMaintenanceDto.staffId },
          });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          const EquipmentRepo =
            transactionalEntityManager.getRepository(RoomEquipment);
          const existingEquipment = await EquipmentRepo.findOne({
            where: { id: createMaintenanceDto.hotelEquipmentId },
          });
          if (!existingEquipment) {
            throw new NotFoundException('Equipment not found');
          }
          await EquipmentRepo.save({
            ...existingEquipment,
            status: EquipmentStatus.MAINTENANCE,
          });

          if (existingEquipment.roomDetailId) {
            const roomRepo = transactionalEntityManager.getRepository(Room);
            const existingRoom = await roomRepo.findOne({
              where: { id: existingEquipment.roomDetailId },
            });
            if (!existingRoom) {
              throw new NotFoundException('Room not found');
            }
            await roomRepo.save({
              ...existingRoom,
              status: RoomStatus.MAINTENANCE,
            });
          }

          const result = await maintenanceRepo.save(createMaintenanceDto);
          return {
            status: true,
            message: 'Create maintenance successfully',
            data: result,
          };
        },
      );
    } catch (error) {
      this.logger.error(
        `Create maintenance error: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create maintenance');
    }
  }
}
