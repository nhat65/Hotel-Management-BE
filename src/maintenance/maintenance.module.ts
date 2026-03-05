import { Module } from '@nestjs/common';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentMaintenance } from 'src/entities/equipment-maintenance.entity';
import { Staff } from 'src/entities/staff.entity';
import { JwtModule } from '@nestjs/jwt';
import { RoomEquipment } from 'src/entities/room-equipment.entity';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      EquipmentMaintenance,
      RoomEquipment,
      Room,
    ]),
    JwtModule.register({}),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}
