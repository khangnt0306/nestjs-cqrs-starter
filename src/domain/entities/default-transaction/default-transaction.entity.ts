import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { PlanItem } from '../planItem/planItem.entity';

@Entity({ name: 'daily_default_transactions' })
@Index(['planItem'])
export class DailyDefaultTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planItemId: string;

  @ManyToOne(() => PlanItem, (p) => p.dailyDefaults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planItemId' })
  planItem: PlanItem;

  @Column()
  label: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
