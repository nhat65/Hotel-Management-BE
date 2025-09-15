import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Attendance } from './attendance.entity';
import { Salary } from './salary.entity';
import { Booking } from './booking.entity';
import { Invoice } from './invoice.entity';
import { EquipmentMaintenance } from './equipment-maintenance.entity';

export enum Position {
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column()
  address: string;

  @Column({ name: 'day_of_birth', type: 'date' })
  dayOfBirth: Date;

  @Column({ type: 'enum', enum: Position })
  position: Position;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @OneToOne(() => Account, (account) => account.staff)
  account: Account;

  @OneToMany(() => Attendance, (attendance) => attendance.staff)
  attendances: Attendance[];

  @OneToMany(() => Salary, (salary) => salary.staff)
  salaries: Salary[];

  @OneToMany(() => Booking, (booking) => booking.createdByStaff)
  bookings: Booking[];

  @OneToMany(() => Invoice, (invoice) => invoice.createdByStaff)
  invoices: Invoice[];

  @OneToMany(() => EquipmentMaintenance, (maintenance) => maintenance.staff)
  maintenances: EquipmentMaintenance[];
}
