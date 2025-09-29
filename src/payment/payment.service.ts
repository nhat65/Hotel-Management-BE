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
          totalAmount: Number(existingInvoice.totalAmount),
          orderInfor: `bill payment for ${createPaymentDto.invoiceId}`,
          invoiceId: createPaymentDto.invoiceId,
        };
        momoPay = await this.momoPayment(momoPayload);
        return {
          status: true,
          message: 'Create payment successfully',
          data: momoPay,
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

  async momoPayment(momoPayload: {
    totalAmount: number;
    orderInfor: string;
    invoiceId: string;
  }) {
    try {
      const accessKey = 'F8BBA842ECF85';
      const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
      const orderInfo = momoPayload.orderInfor;
      const partnerCode = 'MOMO';
      const redirectUrl = 'https://google.com';
      const ipnUrl = 'https://2329172d1f93.ngrok-free.app/payment/momo-ipn';
      const requestType = 'payWithMethod';
      const amount = momoPayload.totalAmount;
      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;
      const extraPayload = { invoiceId: momoPayload.invoiceId, amount };
      const extraData = Buffer.from(JSON.stringify(extraPayload)).toString(
        'base64',
      );
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

  async resolveSuccessPayment(data: { invoiceId: string; amount: number }) {
    try {
      const existingInvoice = await this.invoiceRepository.exists({
        where: { id: data.invoiceId },
      });
      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found');
      }

      const paymentPayload: Partial<Payment> = {
        invoiceId: data.invoiceId,
        amountPaid: data.amount,
        method: PaymentMethod.BANK_TRANSFER,
      };

      await this.paymentRepository.save(paymentPayload);
    } catch (error) {
      this.logger.error(
        `Resolve success payment error: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot resolve success payment');
    }
  }
  
  async checkPaid(invoiceId: string) {
    try {
      const paid = await this.paymentRepository.exists({
        where: { invoiceId },
      });
      if (paid) {
        return {
          status: true,
          message: 'the bill has been paid',
        };
      }
      return {
        status: false,
      };
    } catch (error) {
      this.logger.error(`Check paid error: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Cannot check paid');
    }
  }
}
