import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Plan } from '../plan';
import { PlanItem } from '../planItem/planItem.entity';
import { Category } from '../categories';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity({ name: 'daily_transactions' })
@Index(['plan', 'planItem', 'date'])
export class DailyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planId: string;

  @ManyToOne(() => Plan, (p) => p.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({ nullable: true })
  planItemId?: string;

  @ManyToOne(() => PlanItem, (pi) => pi.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'planItemId' })
  planItem?: PlanItem;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  // type stored for convenience (usually matches planItem.type)
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'date' })
  date: string;

  @Column()
  label: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string;

  // true if system auto-created from DailyDefaultTransaction
  @Column({ default: false })
  isDefaultGenerated: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
