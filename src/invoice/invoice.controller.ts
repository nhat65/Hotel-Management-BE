import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AccountRole } from 'src/entities/account.entity';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoice')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('/create')
  @Roles(AccountRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() request: Request,
  ) {
    return await this.invoiceService.create(
      createInvoiceDto,
      request['user'].id,
    );
  }
}
