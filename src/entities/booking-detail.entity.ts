import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from './room.entity';
import { Service } from './service.entity';
import { Invoice } from './invoice.entity';

@Entity('booking_details')
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_quantity', nullable: true })
  roomQuantity: number;

  @Column({ name: 'service_quantity', nullable: true })
  serviceQuantity: number;

  @Column({
    name: 'room_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  roomPrice: number;

  @Column({
    name: 'service_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  servicePrice: number;

  @Column({ type: 'uuid', name: 'booking_id' })
  bookingId: string;

  @Column({ type: 'uuid', name: 'room_id', nullable: true })
  roomId: string;

  @Column({ type: 'uuid', name: 'service_id', nullable: true })
  serviceId: string;

  @ManyToOne(() => Booking, (booking) => booking.bookingDetails)
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: Booking;

  @ManyToOne(() => Room, (room) => room.bookingDetails, { nullable: true })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;

  @ManyToOne(() => Service, (service) => service.bookingDetails, {
    nullable: true,
  })
  @JoinColumn({ name: 'service_id', referencedColumnName: 'id' })
  service: Service;

  @OneToOne(() => Invoice, (invoice) => invoice.bookingDetail)
  invoice: Invoice;
}
