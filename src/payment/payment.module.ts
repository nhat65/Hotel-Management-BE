import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Payment } from 'src/entities/payment.entity';
import { Staff } from 'src/entities/staff.entity';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Staff, Invoice]),
    JwtModule.register({}),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
