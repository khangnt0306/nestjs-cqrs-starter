import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CategoryStatus, CategoryType } from './categories.enum';
import { User } from '../user/user.entity';
import { PlanItem } from '../planItem/planItem.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.INCOME,
  })
  type: CategoryType;

  @Column({ nullable: true })
  Icon?: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'userId' })
  userId: string;

  @OneToMany(() => PlanItem, (planItem) => planItem.category)
  planItems: PlanItem[];
}
