import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { EquipmentStatus } from '../../entities/room-equipment.entity';

export class RoomEquipmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsEnum(EquipmentStatus)
  @IsNotEmpty({ message: 'Status is required' })
  status: EquipmentStatus;

  @IsDateString()
  @IsNotEmpty({ message: 'Purchase date is required' })
  purchaseDate: Date;

  @IsDateString()
  @IsNotEmpty({ message: 'Warranty expiry is required' })
  warrantyExpiry: Date;

  @IsString()
  @IsOptional()
  note?: string;

  @IsUUID()
  @IsOptional()
  roomDetailId?: string;
}
