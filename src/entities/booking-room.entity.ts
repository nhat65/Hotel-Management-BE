import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingDetail } from './booking-detail.entity';
import { Room } from './room.entity';

@Entity('booking_rooms')
export class BookingRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_detail_id', type: 'uuid' })
  bookingDetailId: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @ManyToOne(() => BookingDetail, (bookingDetail) => bookingDetail.bookingRooms)
  @JoinColumn({ name: 'booking_detail_id', referencedColumnName: 'id' })
  bookingDetail: BookingDetail;

  @ManyToOne(() => Room, (room) => room.bookingRooms)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;
}
