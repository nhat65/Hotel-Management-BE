import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from 'src/entities/staff.entity';
import { Room } from 'src/entities/room.entity';
import { BookingRoom } from 'src/entities/booking-room.entity';
import { Booking } from 'src/entities/booking.entity';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Room, BookingRoom, Booking, Invoice]),
    JwtModule.register({}),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
