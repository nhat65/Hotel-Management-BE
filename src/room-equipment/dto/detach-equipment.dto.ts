import { IsNotEmpty, IsUUID } from 'class-validator';

export class DetachEquipmentDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Room Id is required' })
  roomId: string;
}
