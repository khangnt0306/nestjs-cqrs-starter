import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRole, UserStatus } from './user.enum';
import { Category } from '../categories/category.entity';
import { Plan } from '../plan/plan.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Index()
  @Column({ length: 150 })
  full_name: string;

  @Column({ nullable: true, length: 500 })
  avatar_url?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @OneToMany(() => Category, (category) => category.userId)
  categories: Category[];

  @OneToMany(() => Plan, (plan) => plan.userId)
  plans: Plan[];
}
