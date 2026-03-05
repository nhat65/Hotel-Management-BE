import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoomDto } from './room.dto';
import { Type } from 'class-transformer';

export class CreateRoomDto extends RoomDto {
  @IsArray()
  @Type(() => EquipmentDto)
  @IsOptional()
  equipmentIds?: EquipmentDto[];
}

export class EquipmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Equipment name is required' })
  name: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Equipment id is required' })
  id: string;
}
