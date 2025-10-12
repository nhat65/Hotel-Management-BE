import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CheckinDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Booking id is required' })
  bookingId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  @IsNotEmpty({ message: 'Customer information is required' })
  customers?: CustomerDto[];
}

export class CustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsPhoneNumber('VN', { message: 'Phone number invalid' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined), {
    toClassOnly: true,
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty({ message: 'Identify is required' })
  identify: string;
}
