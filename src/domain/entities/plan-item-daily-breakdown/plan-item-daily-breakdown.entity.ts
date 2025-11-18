import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { PlanItem } from '../planItem/planItem.entity';

@Entity({ name: 'plan_item_daily_breakdowns' })
@Index(['planItem', 'date'])
export class PlanItemDailyBreakdown {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PlanItem, (item) => item.dailyBreakdowns, {
    onDelete: 'CASCADE',
  })
  planItem: PlanItem;

  @Column({ type: 'date' })
  date: string;

  // sum of user-entered actual transactions (only when user inputs)
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  actualAmount: string;

  // optional note
  @Column({ nullable: true })
  note?: string;

  // true when user input overrides default for that day
  @Column({ default: false })
  isOverrideDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
