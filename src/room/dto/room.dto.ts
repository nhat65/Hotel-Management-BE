import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsDecimal,
} from 'class-validator';
import { RoomStatus } from '../../entities/room.entity';
import { Transform } from 'class-transformer';

export class RoomDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'Room number is required' })
  number: number;

  @IsString()
  @IsNotEmpty({ message: 'Room type is required' })
  type: string;

  @IsEnum(RoomStatus)
  @IsNotEmpty({ message: 'Room status is required' })
  status: RoomStatus;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'Capacity is required' })
  capacity: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'Floor is required' })
  floor: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'Price per day is required' })
  pricePerDay: number;
}
