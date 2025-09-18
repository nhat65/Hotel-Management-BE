import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingHandlerService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { JwtModule } from '@nestjs/jwt';
import { BookingDetail } from 'src/entities/booking-detail.entity';
import { Staff } from 'src/entities/staff.entity';
import { Room } from 'src/entities/room.entity';
import { BookingRoom } from 'src/entities/booking-room.entity';
import { Service } from 'src/entities/service.entity';
import { BookingService } from 'src/entities/booking-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      BookingDetail,
      Staff,
      Room,
      BookingRoom,
      Service,
      BookingService,
    ]),
    JwtModule.register({}),
  ],
  controllers: [BookingController],
  providers: [BookingHandlerService],
})
export class BookingModule {}
