import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class MaintenanceDto {
  @IsString()
  @IsNotEmpty({ message: 'Maintenance type is required' })
  maintenanceType: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'Staff ID is required' })
  staffId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Hotel equipment ID is required' })
  hotelEquipmentId: string;
}
