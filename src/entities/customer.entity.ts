import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number', type: 'int' })
  phoneNumber: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column()
  identify: string;

  @Column({ type: 'uuid', name: 'booking_id' })
  bookingId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Booking, (booking) => booking.customers)
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: Booking;
}
