import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DiscountPercent } from 'src/constants/enum';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Booking detail id is required' })
  bookingDetailId: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsEnum(DiscountPercent)
  @IsOptional()
  discount: DiscountPercent;
}
