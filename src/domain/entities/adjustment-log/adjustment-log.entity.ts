import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Plan } from '../plan/plan.entity';
import { PlanItem } from '../planItem/planItem.entity';

@Entity({ name: 'adjustment_logs' })
export class AdjustmentLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Plan, (p) => p.adjustmentLogs, {
    onDelete: 'CASCADE',
  })
  plan: Plan;

  @ManyToOne(() => PlanItem, (pi) => pi.dailyBreakdowns, { nullable: true })
  planItem?: PlanItem;

  @Column({ type: 'date' })
  date: string;

  // previous and new daily allocation (strings for decimal)
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  previousDailyAllocation: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  newDailyAllocation: string;

  @Column()
  reason: string; // e.g. 'exceed_daily_limit' | 'user_override' | 'auto_adjust'

  @CreateDateColumn()
  createdAt: Date;
}
