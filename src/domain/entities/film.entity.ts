import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum FilmStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('films')
export class Film extends BaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: FilmStatus,
    default: FilmStatus.ACTIVE,
  })
  status: FilmStatus;
}
