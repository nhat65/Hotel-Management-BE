import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, RoomStatus } from 'src/entities/room.entity';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Staff } from 'src/entities/staff.entity';
import { Multer } from 'multer';
import { UploadFolder } from 'src/constants/upload.constants';
import { RoomEquipment } from 'src/entities/room-equipment.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CACHE_KEY_ROOM_DETAIL,
  CACHE_KEY_ROOMS,
  CACHE_TTL,
} from 'src/constants/cache';
import { updateRoomDto } from './dto/update-room.dto';
import { SearchRoomDto } from './dto/search-room.dto';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(RoomEquipment)
    private readonly equipmentRepository: Repository<RoomEquipment>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    staffId: string,
    file: Express.Multer.File,
  ) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const existingStaff = await transactionalEntityManager
            .getRepository(Staff)
            .exists({
              where: { id: staffId },
            });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          const existingRoom = await transactionalEntityManager
            .getRepository(Room)
            .exists({
              where: { number: createRoomDto.number },
            });
          if (existingRoom) {
            throw new NotFoundException('Room number is existed');
          }

          createRoomDto.image = file
            ? `/public/uploads/${UploadFolder.ROOMS}/${file.filename}`
            : '';
          const result = await transactionalEntityManager
            .getRepository(Room)
            .save(createRoomDto);

          if (createRoomDto.equipmentIds?.length) {
            for (const equipment of createRoomDto.equipmentIds) {
              const existingEquipment = await transactionalEntityManager
                .getRepository(RoomEquipment)
                .findOne({
                  where: { id: equipment.id },
                });
              if (!existingEquipment) {
                throw new NotFoundException(
                  `Equipment "${equipment.name}" not found`,
                );
              }
              await transactionalEntityManager
                .getRepository(RoomEquipment)
                .save({ ...existingEquipment, roomDetailId: result.id });
            }
          }
          return {
            status: true,
            message: 'Create room successfully',
            data: result,
          };
        },
      );
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
        where: condition,
      });
      await this.cacheManager.set(CACHE_KEY_ROOMS + status, rooms, CACHE_TTL);

      return {
        status: true,
        message: rooms.length
          ? `Get ${status} rooms successfully!`
          : 'No room found',
        data: rooms,
      };
    } catch (error) {
      this.logger.error(`Get rooms error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get rooms');
    }
  }

  async getDetail(roomId: string) {
    try {
      const cachedRoom = await this.cacheManager.get<any[]>(
        CACHE_KEY_ROOM_DETAIL + roomId,
      );
      if (cachedRoom) {
        return {
          status: true,
          message: cachedRoom.length
            ? 'Get room from cache successfully!'
            : 'No room found in cache',
          data: cachedRoom,
        };
      }

      const roomDetail = await this.roomRepository.findOne({
        where: { id: roomId },
        relations: { equipments: true },
      });
      if (!roomDetail) {
        throw new NotFoundException('Room not found');
      }

      await this.cacheManager.set(
        CACHE_KEY_ROOM_DETAIL + roomId,
        roomDetail,
        CACHE_TTL,
      );
      return {
        status: true,
        message: 'Get room detail successfully!',
        data: roomDetail,
      };
    } catch (error) {
      this.logger.error(`Get room detail error: ${error.message}`, error.stack);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot get room detail');
    }
  }

  async update(
    updateRoomDto: updateRoomDto,
    roomId: string,
    file: Express.Multer.File,
    staffId: string,
  ) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingRoom = await this.roomRepository.findOne({
        where: { id: roomId },
      });
      if (!existingRoom) {
        throw new NotFoundException('Room not found');
      }

      updateRoomDto.image = file
        ? `/public/uploads/${UploadFolder.ROOMS}/${file.filename}`
        : '';
      const result = await this.roomRepository.save({
        ...existingRoom,
        ...updateRoomDto,
      });
      return {
        status: true,
        message: 'Update room successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Update room error: ${error.message}`, error.stack);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot update room');
    }
  }

  async search(searchRoomDto: SearchRoomDto) {
    const checkIn = new Date(searchRoomDto.actualCheckIn);
    const checkOut = new Date(searchRoomDto.actualCheckOut);
    try {
      const rooms = await this.roomRepository.find({
        where: {
          ...(searchRoomDto.capacity && {
            capacity: MoreThanOrEqual(searchRoomDto.capacity),
          }),
          ...(searchRoomDto.type && { type: searchRoomDto.type }),
          status: RoomStatus.AVAILABLE,
        },
        relations: {
          bookingRooms: {
            bookingDetail: true,
          },
          equipments: true,
        },
      });

      const availableRooms = rooms.filter((room) => {
        return room.bookingRooms.every((bookingRoom) => {
          const detail = bookingRoom.bookingDetail;
          if (!detail) return true;

          const bookedCheckIn = new Date(detail.actualCheckIn);
          const bookedCheckOut = new Date(detail.actualCheckOut);

          return bookedCheckOut <= checkIn || bookedCheckIn >= checkOut;
        });
      });
      return {
        status: true,
        message: availableRooms.length
          ? 'Found available rooms'
          : 'No available room found',
        data: availableRooms,
      };
    } catch (error) {
      this.logger.error(`Search room error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot search room');
    }
  }
}
