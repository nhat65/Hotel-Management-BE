import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BookingStatus } from 'src/constants/enum';

export class BookingDto {
  @IsEnum(BookingStatus, { message: 'Status not valid' })
  @IsNotEmpty({ message: 'Status is required' })
  status: BookingStatus;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  @IsNotEmpty({ message: 'Check in is required' })
  expectedCheckIn: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  @IsNotEmpty({ message: 'Check out is required' })
  expectedCheckOut: Date;

  @IsString()
  @IsOptional()
  specialRequest: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Total guest is required' })
  totalGuest: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomBookingDto)
  @IsNotEmpty({ message: 'Rooms are required' })
  rooms: RoomBookingDto[];

  @IsNumber()
  @IsNotEmpty({ message: 'Room quantity is required' })
  roomQuantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceBookingDto)
  @IsOptional()
  services?: ServiceBookingDto[];
}

class RoomBookingDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Room Id is required' })
  roomId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Room number is required' })
  number: number;
}

class ServiceBookingDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Service Id is required' })
  serviceId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Service quantity is required' })
  serviceQuantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Service name is required' })
  name: string;
}
