import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from 'src/entities/booking.entity';
import { DataSource, In, Repository } from 'typeorm';
import { BookingDto } from './dto/booking.dto';
import { Staff } from 'src/entities/staff.entity';
import { Room } from 'src/entities/room.entity';
import { BookingDetail } from 'src/entities/booking-detail.entity';
import { BookingRoom } from 'src/entities/booking-room.entity';
import { Service } from 'src/entities/service.entity';
import { BookingService } from 'src/entities/booking-service.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CACHE_KEY_BOOKINGS,
  CACHE_KEY_BOOKINGS_DETAIL,
  CACHE_TTL,
} from 'src/constants/cache';
import { CheckinDto } from './dto/checkin.dto';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class BookingHandlerService {
  private readonly logger = new Logger(BookingHandlerService.name);
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(BookingService)
    private readonly bookingServiceRepository: Repository<BookingService>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async booking(bookingDto: BookingDto, staffId: string) {
    let roomPrice: number;
    let totalServicePrice: number = 0;
    const timeStart = new Date(bookingDto.expectedCheckIn);
    const timeEnd = new Date(bookingDto.expectedCheckOut);

    try {
      if (timeStart >= timeEnd) {
        throw new BadRequestException(
          'Check-in date must be before check-out date',
        );
      }

      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const existingStaff = await transactionalEntityManager
            .getRepository(Staff)
            .exists({ where: { id: staffId } });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          for (const room of bookingDto.rooms) {
            const existingRoom = await this.roomRepository.findOne({
              where: { id: room.roomId, number: room.number },
            });
            if (!existingRoom) {
              throw new NotFoundException(`Room not found: ${room.number}`);
            }
            roomPrice = existingRoom.pricePerDay;
          }

          const bookedRooms: BookingRoom[] = await transactionalEntityManager
            .getRepository(BookingRoom)
            .find({
              where: {
                roomId: In(bookingDto.rooms.map((room) => room.roomId)),
              },
              relations: { room: true, bookingDetail: true },
              select: {
                id: true,
                roomId: true,
                room: { id: true, number: true },
                bookingDetail: { actualCheckIn: true, actualCheckOut: true },
              },
            });

          if (bookedRooms.length > 0) {
            for (const bookedRoom of bookedRooms) {
              const existingStart = new Date(
                bookedRoom.bookingDetail.actualCheckIn,
              );
              const existingEnd = new Date(
                bookedRoom.bookingDetail.actualCheckOut,
              );
              const isOverlap =
                (timeStart >= existingStart && timeStart < existingEnd) ||
                (timeEnd > existingStart && timeEnd <= existingEnd) ||
                (timeStart <= existingStart && timeEnd >= existingEnd);
              if (isOverlap) {
                throw new ConflictException(
                  `Room ${bookedRoom.room.number} is not available for the selected dates`,
                );
              }
            }
          }

          if (bookingDto.services && bookingDto.services.length > 0) {
            for (const service of bookingDto.services) {
              const existingService = await this.serviceRepository.findOne({
                where: { id: service.serviceId },
              });
              if (!existingService) {
                throw new NotFoundException(
                  `Service not found: ${service.name}`,
                );
              }
              totalServicePrice +=
                existingService.price * service.serviceQuantity;
            }
          }

          const bookingPayload: Partial<Booking> = {
            status: bookingDto.status,
            specialRequests: bookingDto.specialRequest,
            totalGuest: bookingDto.totalGuest,
            createdBy: staffId,
            expectedCheckIn: bookingDto.expectedCheckIn,
            expectedCheckOut: bookingDto.expectedCheckOut,
          };
          const booking = await this.bookingRepository.save(bookingPayload);

          const bookingDetailPayload: Partial<BookingDetail> = {
            bookingId: booking.id,
            actualCheckIn: timeStart,
            actualCheckOut: timeEnd,
            roomQuantity: bookingDto.rooms.length,
            roomAmount:
              roomPrice *
              bookingDto.rooms.length *
              ((timeEnd.getTime() - timeStart.getTime()) /
                (1000 * 60 * 60 * 24)),
            totalAmount:
              roomPrice *
                bookingDto.rooms.length *
                ((timeEnd.getTime() - timeStart.getTime()) /
                  (1000 * 60 * 60 * 24)) +
              totalServicePrice,
          };
          const bookingDetail =
            await this.bookingDetailRepository.save(bookingDetailPayload);

          if (bookingDto.services && bookingDto.services.length > 0) {
            for (const service of bookingDto.services) {
              const existingService = await this.serviceRepository.findOne({
                where: { id: service.serviceId },
              });
              if (!existingService) {
                throw new NotFoundException(
                  `Service not found: ${service.name}`,
                );
              }

              const bookingServicePayload: Partial<BookingService> = {
                bookingDetailId: bookingDetail.id,
                serviceId: service.serviceId,
                quantity: service.serviceQuantity,
                totalAmount: existingService.price * service.serviceQuantity,
              };
              await this.bookingServiceRepository.save(bookingServicePayload);
            }
          }

          for (const room of bookingDto.rooms) {
            const bookingRoomPayload: Partial<BookingRoom> = {
              bookingDetailId: bookingDetail.id,
              roomId: room.roomId,
            };
            await this.bookingRoomRepository.save(bookingRoomPayload);
          }

          return {
            status: true,
            message: 'Booking successfully',
          };
        },
      );
    } catch (error) {
      this.logger.error(`Booking error: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot booking');
    }
  }

  async getBookings() {
    try {
      const cachedBookings =
        await this.cacheManager.get<any[]>(CACHE_KEY_BOOKINGS);
      if (cachedBookings) {
        return {
          status: true,
          message: cachedBookings.length
            ? `Get booking from cache successfully!`
            : 'No booking found',
          data: cachedBookings,
        };
      }

      const bookings = await this.bookingRepository.find({
        relations: { bookingDetails: { bookingRooms: { room: true } } },
        order: { createdAt: 'DESC' },
      });
      await this.cacheManager.set(CACHE_KEY_BOOKINGS, bookings, CACHE_TTL);
      return {
        status: true,
        message: bookings.length
          ? `Get bookings successfully!`
          : 'No bookings found',
        data: bookings,
      };
    } catch (error) {
      this.logger.error(`Get bookings error: ${error.message}`, error.stack);
      throw new BadRequestException('Cannot get services');
    }
  }

  async getDetail(bookingId: string) {
    try {
      const cachedBookingDetail = await this.cacheManager.get<any[]>(
        CACHE_KEY_BOOKINGS_DETAIL + bookingId,
      );
      if (cachedBookingDetail) {
        return {
          status: true,
          message: cachedBookingDetail.length
            ? 'Get booking detail from cache successfully!'
            : 'No booking detail found in cache',
          data: cachedBookingDetail,
        };
      }

      const booking = await this.bookingRepository.findOne({
        where: { id: bookingId },
        relations: {
          bookingDetails: {
            bookingRooms: { room: true },
            bookingServices: { service: true },
            invoice: true,
          },
          createdByStaff: true,
        },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      await this.cacheManager.set(
        CACHE_KEY_BOOKINGS_DETAIL + bookingId,
        booking,
        CACHE_TTL,
      );

      return {
        status: true,
        message: 'Get booking detail successfully',
        data: booking,
      };
    } catch (error) {
      this.logger.error(
        `Get booking detail error: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot get booking detail');
    }
  }

  async checkin(checkinDto: CheckinDto, staffId: string) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const existingStaff = await transactionalEntityManager
            .getRepository(Staff)
            .exists({
              where: { id: staffId },
            });
          if (!existingStaff) {
            throw new NotFoundException('Staff not found');
          }

          const existingBooking = await transactionalEntityManager
            .getRepository(Booking)
            .findOne({
              where: {
                id: checkinDto.bookingId,
                status: BookingStatus.PENDING,
              },
            });
          if (!existingBooking) {
            throw new NotFoundException('Booking not found or already checkin');
          }

          if (checkinDto.customers?.length === existingBooking.totalGuest) {
            for (const customer of checkinDto.customers) {
              const addedCustomer = await transactionalEntityManager
                .getRepository(Customer)
                .save({ ...customer, bookingId: checkinDto.bookingId });
              if (!addedCustomer) {
                throw new ConflictException(
                  `Cannot add customer ${customer.fullName} - ${customer.identify}`,
                );
              }
            }
          } else {
            throw new ConflictException(
              `The total number of customers is ${existingBooking.totalGuest} but the customers information provided is only ${checkinDto.customers?.length}`,
            );
          }

          await transactionalEntityManager
            .getRepository(Booking)
            .save({ ...existingBooking, status: BookingStatus.CHECKED_IN });
          return {
            status: true,
            message: 'Checkin successfully',
          };
        },
      );
    } catch (error) {
      this.logger.error(`Checkin error: ${error.message}`, error.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Cannot checkin');
    }
  }
}
