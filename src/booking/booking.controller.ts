import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingHandlerService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AccountRole } from 'src/entities/account.entity';
import { Roles } from 'src/common/decorators/role.decorator';
import { CheckinDto } from './dto/checkin.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingHandlerService) {}

  @Post('/create')
  @Roles(AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async create(@Body() bookingDto: BookingDto, @Req() request: Request) {
    return await this.bookingService.booking(bookingDto, request['user'].id);
  }

  @Post('/checkin')
  @Roles(AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  async checkin(@Body() checkinDto: CheckinDto, @Req() request: Request) {
    return await this.bookingService.checkin(checkinDto, request['user'].id);
  }

  @Get('/')
  @Roles(AccountRole.RECEPTIONIST, AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getBookings() {
    return await this.bookingService.getBookings();
  }

  @Get('/:bookingId')
  @Roles(AccountRole.RECEPTIONIST, AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async getDetail(@Param('bookingId') bookingId: string) {
    return await this.bookingService.getDetail(bookingId);
  }
}
