import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class SearchRoomDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  @IsNotEmpty({ message: 'Check in is required' })
  actualCheckIn: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  @IsNotEmpty({ message: 'Check in is required' })
  actualCheckOut: Date;
}
