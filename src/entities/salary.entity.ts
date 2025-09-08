import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.entity';

@Entity('salary')
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  month: Date;

  @Column({ name: 'base_salary', type: 'decimal', precision: 8, scale: 2 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  bonus: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  deduction: number;

  @Column({ name: 'net_salary', type: 'decimal', precision: 8, scale: 2 })
  netSalary: number;

  @Column({ name: 'payment_date' })
  paymentDate: Date;

  @Column()
  note: string;

  @Column({ type: 'uuid', name: 'staff_id' })
  staffId: string;

  @ManyToOne(() => Staff, (staff) => staff.salaries)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;
}
