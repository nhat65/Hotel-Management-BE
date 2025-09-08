import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingDetail } from './booking-detail.entity';
import { RoomEquipment } from './room-equipment.entity';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
}

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: RoomStatus })
  status: RoomStatus;

  @Column()
  capacity: number;

  @Column()
  floor: number;

  @Column()
  image: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'price_per_day', type: 'decimal', precision: 8, scale: 2 })
  pricePerDay: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.room)
  bookingDetails: BookingDetail[];

  @OneToMany(() => RoomEquipment, (roomEquipment) => roomEquipment.room)
  equipments: RoomEquipment[];
}
