import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { distinct } from 'rxjs';
import { ZERO } from 'src/constants/enum';
import { BookingRoom } from 'src/entities/booking-room.entity';
import { Booking, BookingStatus } from 'src/entities/booking.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { Room } from 'src/entities/room.entity';
import { Staff } from 'src/entities/staff.entity';
import { Between, IsNull, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async dashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    try {
      const allBooking = await this.bookingRepository.find({
        where: { createdAt: Between(startOfMonth, endOfMonth) },
      });
      const totalMonthBookings = allBooking.length;
      const pendingBookings = allBooking.filter(
        (booking) => booking.status === BookingStatus.PENDING,
      ).length;
      const cancelledBookings = allBooking.filter(
        (booking) => booking.status === BookingStatus.CANCELLED,
      ).length;
      const rooms = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect(
          'room.bookingRooms',
          'booking_rooms',
          'booking_rooms.createdAt BETWEEN :start AND :end',
          {
            start: startOfMonth,
            end: endOfMonth,
          },
        )
        .getMany();
      const availableRooms = rooms.filter(
        (room) => room.bookingRooms.length === ZERO,
      ).length;
      const occupiedRooms = rooms.filter(
        (room) => room.bookingRooms.length > ZERO,
      ).length;
      const totalRevenue = await this.invoiceRepository.sum('totalAmount');
      const monthlyRevenue = await this.invoiceRepository.sum('totalAmount', {
        createdAt: Between(startOfMonth, endOfMonth),
      });
      const checkInsToday = await this.bookingRepository.count({
        where: { createdAt: now, status: BookingStatus.CHECKED_IN },
      });
      const checkOutsToday = await this.bookingRepository.count({
        where: { createdAt: now, status: BookingStatus.CHECKED_OUT },
      });
      const occupancyRate =
        (occupiedRooms / (occupiedRooms + availableRooms)) * 100;
      const dashboard = {
        totalMonthBookings,
        occupiedRooms,
        availableRooms,
        totalRevenue,
        monthlyRevenue,
        checkInsToday,
        checkOutsToday,
        occupancyRate,
        pendingBookings,
        cancelledBookings,
      };
      return {
        status: true,
        message: 'Get dashboard stats successfully',
        data: dashboard,
      };
    } catch (error) {
      this.logger.error('Failed to get dashboard stats', error.stack);
      throw new BadRequestException('Cannot get dashboard stats.');
    }
  }
}
