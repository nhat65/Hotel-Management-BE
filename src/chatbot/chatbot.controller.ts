import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MessagePayloadDto } from './dto/message-payload.dto';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('/')
  async resolveQuestion(
    @Body() data: MessagePayloadDto,
    @Req() request: Request,
  ) {
    return await this.chatbotService.handleQuestion(data, request['user'].id);
  }
}
