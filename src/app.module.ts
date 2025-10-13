import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database.config';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { RoomEquipmentModule } from './room-equipment/room-equipment.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ServiceModule } from './service/service.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    StaffModule,
    BookingModule,
    RoomModule,
    RoomEquipmentModule,
    MaintenanceModule,
    InvoiceModule,
    PaymentModule,
    ChatbotModule,
    ServiceModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
