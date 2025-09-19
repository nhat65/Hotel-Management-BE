import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Staff } from 'src/entities/staff.entity';
import { Multer } from 'multer';
import { UploadFolder } from 'src/constants/upload.constants';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
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
}
