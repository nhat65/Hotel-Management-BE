import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { RefreshToken } from './refresh-token.entity';

export enum AccountRole {
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
}

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 100 })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'role', type: 'enum', enum: AccountRole })
  role: AccountRole;

  @Column({ name: 'staff_id', type: 'uuid' })
  staffId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Staff, (staff) => staff.account)
  @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
  staff: Staff;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.account)
  refreshTokens: RefreshToken[];
}
