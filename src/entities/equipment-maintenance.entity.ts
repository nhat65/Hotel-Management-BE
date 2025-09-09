import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoomEquipment } from './room-equipment.entity';
import { Staff } from './staff.entity';

@Entity('equipment_maintenance')
export class EquipmentMaintenance {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'maintenance_type' })
  maintenanceType: string;

  @Column()
  description: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId: string;

  @Column({ name: 'hotel_equipment_id', type: 'uuid' })
  hotelEquipmentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RoomEquipment, (equipment) => equipment.maintenances)
  @JoinColumn({ name: 'hotel_equipment_id', referencedColumnName: 'id' })
  equipment: RoomEquipment;

  @ManyToOne(() => Staff, (staff) => staff.maintenances)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;
}
