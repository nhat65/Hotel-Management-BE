import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Position } from 'src/constants/enum';

export class StaffDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  dayOfBirth: Date;

  @IsEnum(Position, { message: 'Position not valid' })
  @IsNotEmpty({ message: 'Position is required' })
  position: Position;

  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email?: string;
}
