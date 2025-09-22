import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { EquipmentMaintenance } from './equipment-maintenance.entity';

export enum EquipmentStatus {
  ALL = 'all',
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  BROKEN = 'broken',
  MAINTENANCE = 'maintenance',
}

@Entity('room_equipment')
export class RoomEquipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: EquipmentStatus })
  status: EquipmentStatus;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @Column({ name: 'warranty_expiry', type: 'date' })
  warrantyExpiry: Date;

  @Column({ type: 'text' })
  note: string;

  @Column({ name: 'room_detail_id', nullable: true, type: 'uuid' })
  roomDetailId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Room, (room) => room.equipments, { nullable: true })
  @JoinColumn({ name: 'room_detail_id', referencedColumnName: 'id' })
  room: Room;

  @OneToMany(() => EquipmentMaintenance, (maintenance) => maintenance.equipment)
  maintenances: EquipmentMaintenance[];
}
