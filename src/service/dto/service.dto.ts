import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ServiceStatus } from 'src/constants/enum';

export class ServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Service name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit is required' })
  unit: string;

  @IsEnum(ServiceStatus)
  @IsNotEmpty({ message: 'Status is required' })
  status: ServiceStatus;
}
