import { Module } from '@nestjs/common';
import { RoomEquipmentController } from './room-equipment.controller';
import { RoomEquipmentService } from './room-equipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEquipment } from 'src/entities/room-equipment.entity';
import { JwtModule } from '@nestjs/jwt';
import { Room } from 'src/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEquipment, Room]),
    JwtModule.register({}),
  ],
  controllers: [RoomEquipmentController],
  providers: [RoomEquipmentService],
})
export class RoomEquipmentModule {}
