import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, RoomStatus } from 'src/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Staff } from 'src/entities/staff.entity';
import { Multer } from 'multer';
import { UploadFolder } from 'src/constants/upload.constants';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY_ROOMS, CACHE_TTL } from 'src/constants/cache';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    staffId: string,
    file: Express.Multer.File,
  ) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingRoom = await this.roomRepository.exists({
        where: { number: createRoomDto.number },
      });
      if (existingRoom) {
        throw new NotFoundException('Room number is existed');
      }

      createRoomDto.image = file
        ? `/public/uploads/${UploadFolder.ROOMS}/${file.filename}`
        : '';
      const result = await this.roomRepository.save(createRoomDto);
      return {
        status: true,
        message: 'Create room successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Create room error: ${error.message}`, error.stack);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create room');
    }
  }

  async getRooms(status: RoomStatus) {
    try {
      const cachedRooms = await this.cacheManager.get<Room[]>(
        CACHE_KEY_ROOMS + status,
      );
      if (cachedRooms) {
        return {
          status: true,
          message: cachedRooms.length
            ? `Get ${status} room from cache successfully!`
            : 'No room found',
          data: cachedRooms,
        };
      }

      const condition =
        status === RoomStatus.ALL ? {} : { status: status as RoomStatus };
      const rooms = await this.roomRepository.find({
        select: [
          'id',
          'number',
          'type',
          'capacity',
          'floor',
          'image',
          'description',
          'pricePerDay',
        ],
        where: condition,
      });
      await this.cacheManager.set(CACHE_KEY_ROOMS + status, rooms, CACHE_TTL);

      return {
        status: true,
        message:
          rooms.length
            ? `Get ${status} rooms successfully!`
            : 'No room found',
        data: rooms,
      };
    } catch (error) {
      this.logger.error(`Get rooms error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get rooms');
    }
  }
}
