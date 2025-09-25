import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Staff } from 'src/entities/staff.entity';
import { PaymentMethod } from 'src/constants/enum';
import { Invoice } from 'src/entities/invoice.entity';
import { NotFoundError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, staffId: string) {
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new BadRequestException('Staff not found');
      }

      const existingInvoice = await this.invoiceRepository.findOne({
        where: { id: createPaymentDto.invoiceId },
      });
      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found');
      }

      const paymentPayload: Partial<Payment> = {
        method: createPaymentDto.method,
        amountPaid: existingInvoice.totalAmount,
        invoiceId: createPaymentDto.invoiceId,
      };

      if (createPaymentDto.method === PaymentMethod.BANK_TRANSFER) {
        var momoPay: any;
        const momoPayload = {
          amount: Number(existingInvoice.totalAmount),
          orderInfor: `bill payment for ${createPaymentDto.invoiceId}`,
        };
        momoPay = await this.momoPayment(momoPayload);
        const result = await this.paymentRepository.save(paymentPayload);
        return {
          status: true,
          message: 'Create payment successfully',
          data: { ...momoPay, ...result },
        };
      }

      const result = await this.paymentRepository.save(paymentPayload);
      return {
        status: true,
        message: 'Create payment successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Create payment error: ${error.message}`, error.stack);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create payment');
    }
  }

  async momoPayment(momoPayload: any) {
    try {
      const accessKey = 'F8BBA842ECF85';
      const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
      const orderInfo = momoPayload.orderInfor;
      const partnerCode = 'MOMO';
      const redirectUrl =
        'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
      const ipnUrl =
        'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
      const requestType = 'payWithMethod';
      const amount = momoPayload.amount;
      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;
      const extraData = '';
      const paymentCode =
        'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature: string = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

      const requestBody = JSON.stringify({
        partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: 'vi',
        requestType,
        autoCapture: true,
        extraData,
        orderGroupId: '',
        signature,
      });

      const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
        timeout: 10000,
      };
      const result = await axios(options);
      return result.data;
    } catch (error) {
      this.logger.error(`Momo payment error: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Cannot create payment');
    }
  }
}
