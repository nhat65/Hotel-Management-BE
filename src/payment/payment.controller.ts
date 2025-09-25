import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AccountRole } from 'src/entities/account.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() request: Request,
  ) {
    return await this.paymentService.create(
      createPaymentDto,
      request['user'].id,
    );
  }
}
