import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from 'src/entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Staff]), JwtModule.register({})],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
