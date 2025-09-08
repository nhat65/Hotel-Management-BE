import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.entity';

export enum Shift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  FULL = 'full',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late',
  ABSENT = 'absent',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: Shift })
  shift: Shift;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: 'uuid', name: 'staff_id' })
  staffId: string;

  @Column({ name: 'check_in', type: 'time' })
  checkIn: string;

  @Column({ name: 'check_out', type: 'time' })
  checkOut: string;

  @ManyToOne(() => Staff, (staff) => staff.attendances)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;
}
