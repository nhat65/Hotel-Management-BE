import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from 'src/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Staff]), JwtModule.register({})],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
