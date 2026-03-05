import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Customer } from './customer.entity';
import { BookingDetail } from './booking-detail.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @Column({ name: 'expected_check_in', type: 'date' })
  expectedCheckIn: Date;

  @Column({ name: 'expected_check_out', type: 'date' })
  expectedCheckOut: Date;

  @Column({ name: 'special_requests', nullable: true })
  specialRequests: string;

  @Column({ name: 'total_guest' })
  totalGuest: number;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Staff, (staff) => staff.bookings)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdByStaff: Staff;

  @OneToMany(() => Customer, (customer) => customer.booking)
  customers: Customer[];

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking)
  bookingDetails: BookingDetail[];
}
