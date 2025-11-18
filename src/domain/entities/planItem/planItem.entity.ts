import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Plan } from '../plan/plan.entity';
import { Category } from '../categories/category.entity';
import { EXCLUDE_TYPE, PlanItemType } from './planItem.enum';
import { DailyDefaultTransaction } from '../default-transaction';
import { DailyTransaction } from '../daily-transaction/daily-transaction.entity';
import { PlanItemDailyBreakdown } from '../plan-item-daily-breakdown/plan-item-daily-breakdown.entity';

@Entity('plan_items')
export class PlanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planId: string;

  @ManyToOne(() => Plan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, (category) => category.planItems, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'enum', enum: PlanItemType })
  type: PlanItemType;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EXCLUDE_TYPE })
  excludeType: EXCLUDE_TYPE;

  @Column({ default: false })
  isDailyBased: boolean;

  @OneToMany(() => PlanItemDailyBreakdown, (b) => b.planItem, {
    cascade: ['insert', 'update', 'remove'],
  })
  dailyBreakdowns: PlanItemDailyBreakdown[];

  @OneToMany(() => DailyDefaultTransaction, (t) => t.planItem)
  dailyDefaults: DailyDefaultTransaction[];

  @OneToMany(() => DailyTransaction, (t) => t.planItem)
  transactions: DailyTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
