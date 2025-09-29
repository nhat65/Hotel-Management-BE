import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetail } from 'src/entities/booking-detail.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Staff } from 'src/entities/staff.entity';
import { BookingRoom } from 'src/entities/booking-room.entity';
import { tax } from 'src/constants/enum';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CACHE_KEY_INVOICES,
  CACHE_KEY_INVOICES_DETAIL,
  CACHE_TTL,
} from 'src/constants/cache';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, staffId: string) {
    let totalServicePrice: number = 0;
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: { id: staffId },
      });
      if (!existingStaff) {
        throw new NotFoundException('Staff not found');
      }

      const existingBookingDetail = await this.bookingDetailRepository.findOne({
        relations: { bookingServices: { service: true }, bookingRooms: true },
        where: { id: createInvoiceDto.bookingDetailId },
      });
      if (!existingBookingDetail) {
        throw new NotFoundException('Booking not found');
      }

      const existingInvoice = await this.invoiceRepository.exists({
        where: { bookingDetailId: createInvoiceDto.bookingDetailId },
      });
      if (existingInvoice) {
        throw new NotFoundException('Invoice already existed');
      }

      for (const service of existingBookingDetail.bookingServices) {
        totalServicePrice += parseFloat(service.totalAmount as any);
      }
      const subtotal =
        parseFloat(existingBookingDetail.roomAmount as any) + totalServicePrice;
      const taxAmount = parseFloat((subtotal * (tax / 100)).toFixed(2));
      const discountAmount = parseFloat(
        (subtotal * (createInvoiceDto.discount / 100)).toFixed(2),
      );
      const invoicePayload: Partial<Invoice> = {
        roomAmount: existingBookingDetail.roomAmount,
        serviceAmount: totalServicePrice,
        subtotal: parseFloat(subtotal.toFixed(2)),
        note: createInvoiceDto.note,
        bookingDetailId: createInvoiceDto.bookingDetailId,
        time: new Date(),
        taxAmount,
        discountAmount,
        totalAmount: parseFloat(
          (subtotal + taxAmount - discountAmount).toFixed(2),
        ),
        createdBy: staffId,
      };
      const result = await this.invoiceRepository.save(invoicePayload);
      return {
        status: true,
        message: 'Create invoice successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Failed to create invoice', error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot create invoice');
    }
  }

  async getDetail(invoiceId: string) {
    try {
      const cachedInvoiceDetail = await this.cacheManager.get<any[]>(
        CACHE_KEY_INVOICES_DETAIL + invoiceId,
      );
      if (cachedInvoiceDetail) {
        return {
          status: true,
          message: cachedInvoiceDetail.length
            ? 'Get invoice detail from cache successfully!'
            : 'No invoice detail found in cache',
          data: cachedInvoiceDetail,
        };
      }

      const invoice = await this.invoiceRepository.findOne({
        where: { id: invoiceId },
      });
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
      await this.cacheManager.set(
        CACHE_KEY_INVOICES_DETAIL + invoiceId,
        invoice,
        CACHE_TTL,
      );
      return {
        status: true,
        message: 'Get invoice detail successfully',
        data: invoice,
      };
    } catch (error) {
      this.logger.error(
        `Get invoice detail error: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot get invoice detail');
    }
  }

  async getInvoices() {
    try {
      const cachedInvoices =
        await this.cacheManager.get<any[]>(CACHE_KEY_INVOICES);
      if (cachedInvoices) {
        return {
          status: true,
          message: cachedInvoices.length
            ? `Get invoices from cache successfully!`
            : 'No invoices found',
          data: cachedInvoices,
        };
      }

      const invoices = await this.invoiceRepository.find({
        relations: { payment: true },
        order: { createdAt: 'DESC' },
      });
      await this.cacheManager.set(CACHE_KEY_INVOICES, invoices, CACHE_TTL);
      return {
        status: true,
        message: invoices.length
          ? `Get invoices successfully!`
          : 'No invoices found',
        data: invoices,
      };
    } catch (error) {
      this.logger.error(`Get invoices error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get invoices');
    }
  }
}
