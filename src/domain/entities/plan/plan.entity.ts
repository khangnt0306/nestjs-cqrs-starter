import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  // OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user';
import { RepeatType } from './plan.enum';
import { PlanItem } from '../planItem/planItem.entity';
// import { DailySummary } from './daily-summary.entity';
// import { AdjustmentLog } from './adjustment-log.entity';
// import { Notification } from './notification.entity';
// import { Transaction } from './transaction.entity';

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

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: RepeatType, default: RepeatType.NONE })
  repeatType: RepeatType;

  @Column({ default: true })
  autoAdjustEnabled: boolean;

  @Column({ type: 'decimal', nullable: true })
  dailyMinLimit: number;

  @Column({ type: 'decimal', nullable: true })
  warnLevelYellow: number;

  @Column({ type: 'decimal', nullable: true })
  warnLevelRed: number;

  // @OneToMany(() => PlanItem, planItem => planItem.plan)
  // items: PlanItem[];

  // @OneToMany(() => DailySummary, summary => summary.plan)
  // dailySummaries: DailySummary[];

  // @OneToMany(() => AdjustmentLog, log => log.plan)
  // adjustmentLogs: AdjustmentLog[];

  // @OneToMany(() => Notification, notification => notification.plan)
  // notifications: Notification[];

  // @OneToMany(() => Transaction, transaction => transaction.plan)
  // transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
