import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Plan } from '../plan/plan.entity';

export enum DailyStatus {
  OK = 'ok',
  WARNING = 'warning',
  EXCEED = 'exceed',
}

@Entity({ name: 'daily_summaries' })
@Index(['plan', 'date'], { unique: true })
export class DailySummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Plan, (p) => p.dailySummaries, {
    onDelete: 'CASCADE',
  })
  plan: Plan;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0' })
  totalPlannedIncome: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0' })
  totalActualIncome: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0' })
  totalPlannedExpense: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: '0' })
  totalActualExpense: string;

  @Column({ type: 'enum', enum: DailyStatus, default: DailyStatus.OK })
  status: DailyStatus;

  // For FLEXIBLE items: average daily amount calculated
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  flexibleAverageAmount?: string;

  // For FLEXIBLE items: minimum threshold based on percentage
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  flexibleMinimumThreshold?: string;

  // Warning flag if actual amount is below minimum
  @Column({ default: false })
  isBelowMinimum: boolean;
}
