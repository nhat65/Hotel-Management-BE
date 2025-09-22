import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { FileSizeValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { UploadFolder } from 'src/constants/upload.constants';
import { UploadImageInterceptor } from 'src/common/interceptors/upload-file.interceptor';
import { RoomStatus } from 'src/constants/enum';

@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  @UseInterceptors(UploadImageInterceptor('image', UploadFolder.ROOMS))
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.roomService.create(
      createRoomDto,
      request['user'].id,
      file,
    );
  }

  @Get('/:status')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async getRooms(@Param('status') status: RoomStatus) {
    return await this.roomService.getRooms(status);
  }
}
