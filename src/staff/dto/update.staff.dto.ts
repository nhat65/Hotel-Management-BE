import { IsNotEmpty, IsUUID } from 'class-validator';
import { StaffDto } from './staff.dto';

export class UpdateStaffDto extends StaffDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Staff id is required' })
  id: string;
}
