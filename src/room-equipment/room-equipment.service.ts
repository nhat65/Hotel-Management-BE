import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEquipment } from 'src/entities/room-equipment.entity';
import { Repository } from 'typeorm';
import { RoomEquipmentDto } from './dto/room-equipment.dto';
import { Room } from 'src/entities/room.entity';
import { EquipmentStatus } from 'src/constants/enum';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY_EQUIPMENTS, CACHE_TTL } from 'src/constants/cache';

@Injectable()
export class RoomEquipmentService {
  private readonly logger = new Logger(RoomEquipmentService.name);
  constructor(
    @InjectRepository(RoomEquipment)
    private readonly roomEquipmentRepository: Repository<RoomEquipment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(roomEquipmentDto: RoomEquipmentDto) {
    try {
      if (roomEquipmentDto.roomDetailId) {
        const existingRoom = await this.roomRepository.exists({
          where: { id: roomEquipmentDto.roomDetailId },
        });
        if (!existingRoom) {
          throw new NotFoundException('Room not found');
        }
        roomEquipmentDto.status = EquipmentStatus.IN_USE;
      }

      const result = await this.roomEquipmentRepository.save(roomEquipmentDto);
      return {
        status: true,
        message: '',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to create room equipment', error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create equipment');
    }
  }

  async getEquipments(status: EquipmentStatus) {
    try {
      const cachedEquipments = await this.cacheManager.get<RoomEquipment[]>(
        CACHE_KEY_EQUIPMENTS + status,
      );
      if (cachedEquipments) {
        return {
          status: true,
          message:
            cachedEquipments.length
              ? 'Get equipments from cache successfully!'
              : 'No Equipments found in cache',
          data: cachedEquipments,
        };
      }

      const condition =
        status === EquipmentStatus.ALL ? {} : { status: status as EquipmentStatus };
      const equipments = await this.roomEquipmentRepository.find({
        select: [
          'id',
          'name',
          'category',
          'quantity',
          'status',
          'note',
          'roomDetailId',
        ],
        where: condition,
      });
      await this.cacheManager.set(
        CACHE_KEY_EQUIPMENTS + status,
        equipments,
        CACHE_TTL,
      );
      return {
        status: true,
        message:
          equipments.length
            ? 'Get equipments from cache successfully!'
            : 'No equipments found in cache',
        data: equipments,
      };
    } catch (error) {
      this.logger.error('Failed get room equipment', error.stack);
      throw new BadRequestException('Cannot get equipments');
    }
  }
}
