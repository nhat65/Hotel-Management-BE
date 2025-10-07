import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { MessagePayloadDto } from './dto/message-payload.dto';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly configService: ConfigService,
  ) {}

  async handleQuestion(data: MessagePayloadDto, staffId: string) {
    try {
      const existingStaff = await this.staffRepository.exists({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
      if (!webhookUrl) {
        throw new BadRequestException('Webhook URL is not configured');
      }

      const response = await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = parseMarkdownJson(response.data.output);
      return {
        status: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to handle user question', error.stack);
      throw new BadRequestException('Cannot handle user question');
    }
  }
}

export function parseMarkdownJson<T = any>(input: string): T | null {
  try {
    let cleaned = input.trim();
    const jsonBlockRegex = /```json\s*\n?([\s\S]*?)\n?```/i;
    const match = cleaned.match(jsonBlockRegex);
    if (match && match[1]) {
      cleaned = match[1].trim();
    } else {
      cleaned = cleaned
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim();
    }

    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');
    const lastJsonChar = Math.max(lastBrace, lastBracket);
    if (lastJsonChar !== -1) {
      cleaned = cleaned.substring(0, lastJsonChar + 1);
    }

    cleaned = cleaned.replace(/\\n/g, '');
    let parsed: any = JSON.parse(cleaned);
    if (parsed && typeof parsed.response === 'string') {
      try {
        parsed.response = JSON.parse(parsed.response);
      } catch {}
    }

    return parsed as T;
  } catch (error) {
    this.logger.error('Failed to parse markdown JSON: ', error.stack);
    throw new BadRequestException('Failed to parse markdown JSON');
  }
}
