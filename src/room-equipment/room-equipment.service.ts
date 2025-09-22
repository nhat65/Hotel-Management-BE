import {
  BadRequestException,
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

@Injectable()
export class RoomEquipmentService {
  private readonly logger = new Logger(RoomEquipmentService.name);
  constructor(
    @InjectRepository(RoomEquipment)
    private readonly roomEquipmentRepository: Repository<RoomEquipment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
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
}
