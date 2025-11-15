import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { PostSource, PostStatus, PostType, PostVisibility } from './post.enum';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PostType })
  type: PostType;

  @Column({ type: 'enum', enum: PostVisibility })
  visibility: PostVisibility;

  @Column({ type: 'enum', enum: PostSource })
  source: PostSource;

  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;
}
