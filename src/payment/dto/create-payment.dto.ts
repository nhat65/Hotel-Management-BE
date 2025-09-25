import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from 'src/constants/enum';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Invoice id is required' })
  invoiceId: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty({ message: 'Payment method is required' })
  method: PaymentMethod;
}
