import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 8, scale: 2 })
  amountPaid: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @OneToOne(() => Invoice, (invoice) => invoice.payment)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
