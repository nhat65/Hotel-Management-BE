import { IsString } from 'class-validator';

export class MessagePayloadDto {
  @IsString()
  message: string;
}
