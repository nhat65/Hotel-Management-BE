import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingDetail } from './booking-detail.entity';
import { Room } from './room.entity';
import { Service } from './service.entity';

@Entity('booking_services')
export class BookingService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_detail_id', type: 'uuid' })
  bookingDetailId: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 8, scale: 2 })
  totalAmount: number;

  @ManyToOne(
    () => BookingDetail,
    (bookingDetail) => bookingDetail.bookingServices,
  )
  @JoinColumn({ name: 'booking_detail_id', referencedColumnName: 'id' })
  bookingDetail: BookingDetail;

  @ManyToOne(() => Service, (service) => service.bookingServices)
  @JoinColumn({ name: 'service_id', referencedColumnName: 'id' })
  service: Service;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
