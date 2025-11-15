import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PostEntity } from '../post/post.entity';
import { UserRole, UserStatus } from './user.enum';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Index()
  @Column({ length: 150 })
  full_name: string;

  @Column({ length: 150 })
  user_name: string;

  @Column({ nullable: true, length: 20 })
  phone_number?: string;

  @Column({ nullable: true, type: 'date' })
  date_of_birth?: Date;

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
}
