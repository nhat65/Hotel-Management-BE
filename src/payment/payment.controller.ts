import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() request: Request,
  ) {
    return await this.paymentService.create(
      createPaymentDto,
      request['user'].id,
    );
  }

  @Post('momo-ipn')
  async handleMomoWebhook(@Body() body: any) {
    const decoded = JSON.parse(
      Buffer.from(body.extraData, 'base64').toString(),
    );
    await this.paymentService.resolveSuccessPayment(decoded);
  }

  @Get('/:invoiceId/check')
  @Roles(AccountRole.ADMIN, AccountRole.RECEPTIONIST)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async checkPaid(@Param('invoiceId') invocieId: string) {
    return await this.paymentService.checkPaid(invocieId);
  }
}
