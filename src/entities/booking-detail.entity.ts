import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Invoice } from './invoice.entity';
import { BookingRoom } from './booking-room.entity';
import { BookingService } from './booking-service.entity';

@Entity('booking_details')
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'booking_id' })
  bookingId: string;

  @Column({ name: 'actual_check_in', type: 'date', nullable: true })
  actualCheckIn: Date;

  @Column({ name: 'actual_check_out', type: 'date', nullable: true })
  actualCheckOut: Date;

  @Column({ name: 'room_quantity', type: 'int' })
  roomQuantity: number;

  @Column({ name: 'room_amount', type: 'decimal', precision: 8, scale: 2 })
  roomAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 8, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingDetails)
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: Booking;

  @OneToOne(() => Invoice, (invoice) => invoice.bookingDetail)
  invoice: Invoice;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.bookingDetail)
  bookingRooms: BookingRoom[];

  @OneToMany(
    () => BookingService,
    (bookingService) => bookingService.bookingDetail,
  )
  bookingServices: BookingService[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
