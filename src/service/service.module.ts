import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from 'src/entities/staff.entity';
import { Service } from 'src/entities/service.entity';
import { BookingService } from 'src/entities/booking-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Service, BookingService]),
    JwtModule.register({}),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
