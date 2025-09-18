import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BookingDetail } from './booking-detail.entity';
import { Staff } from './staff.entity';
import { Payment } from './payment.entity';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'time', type: 'date' })
  time: Date;

  @Column({ name: 'room_amount', type: 'decimal', precision: 8, scale: 2 })
  roomAmount: number;

  @Column({ name: 'service_amount', type: 'decimal', precision: 8, scale: 2 })
  serviceAmount: number;

  @Column({ name: 'sub_total', type: 'decimal', precision: 8, scale: 2 })
  subtotal: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 8, scale: 2 })
  taxAmount: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 8, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  note: string;

  @Column({ name: 'booking_detail_id', type: 'uuid' })
  bookingDetailId: string;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => BookingDetail, (bookingDetail) => bookingDetail.invoice)
  @JoinColumn({ name: 'booking_detail_id', referencedColumnName: 'id' })
  bookingDetail: BookingDetail;

  @ManyToOne(() => Staff, (staff) => staff.invoices)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdByStaff: Staff;

  @OneToOne(() => Payment, (payment) => payment.invoice)
  payment: Payment;
}
