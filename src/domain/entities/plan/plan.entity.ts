import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user';
import { PlanStatus, PlanType } from './plan.enum';
import { PlanItem } from '../planItem/planItem.entity';
import { DailyTransaction } from '../daily-transaction/daily-transaction.entity';
import { DailySummary } from '../daily-summary/daily-summary.entity';
import { AdjustmentLog } from '../adjustment-log/adjustment-log.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.plans)
  @JoinColumn({ name: 'userId' })
  userId: string;

  @OneToMany(() => PlanItem, (item) => item.plan, {
    cascade: ['insert', 'update'],
  })
  items: PlanItem[];

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.MONTHLY })
  planType: PlanType;

  @Column({ default: false })
  autoRepeat: boolean;

  @Column({ default: true })
  autoAdjustEnabled: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalBudget: number;

  @Column({ type: 'enum', enum: PlanStatus, default: PlanStatus.INACTIVE })
  status: PlanStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  dailyMinLimit: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  warnLevelYellow: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  warnLevelRed: number;

  @OneToMany(() => DailyTransaction, (tx) => tx.plan, {
    cascade: ['insert', 'update', 'remove'],
  })
  transactions: DailyTransaction[];

  @OneToMany(() => DailySummary, (summary) => summary.plan)
  dailySummaries: DailySummary[];

  @OneToMany(() => AdjustmentLog, (log) => log.plan)
  adjustmentLogs: AdjustmentLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
