import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Invoice } from 'src/entities/invoice.entity';
import { Staff } from 'src/entities/staff.entity';
import { BookingDetail } from 'src/entities/booking-detail.entity';
import { BookingRoom } from 'src/entities/booking-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Invoice, BookingDetail, BookingRoom]),
    JwtModule.register({}),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
