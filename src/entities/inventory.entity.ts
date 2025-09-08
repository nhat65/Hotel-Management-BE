import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Unit {
  PIECE = 'piece',
  KILOGRAM = 'kilogram',
  LITER = 'liter',
  METER = 'meter',
}

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ type: 'bigint' })
  quantity: bigint;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: Unit })
  unit: Unit;

  @Column({ name: 'min_stock_level' })
  minStockLevel: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
