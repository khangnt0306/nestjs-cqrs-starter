import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Plan } from '@domain/entities/plan/plan.entity';
import { PlanType } from '@domain/entities/plan/plan.enum';

export interface GetPlansFilter {
  name?: string;
  planType?: PlanType;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class PlanRepository extends BaseRepository<Plan> {
  constructor(dataSource: DataSource) {
    super(Plan, dataSource);
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.findOne({ where: { name } });
  }

  async findByPlanType(planType: PlanType): Promise<Plan[]> {
    return this.find({ where: { planType } });
  }

  async getPlansWithFilters(
    filter: GetPlansFilter,
    paging: PagingOptions,
    textSearch?: string,
    userId?: string,
  ): Promise<[Plan[], number]> {
    let qb = this.createQueryBuilder('plan').leftJoinAndSelect(
      'plan.items',
      'items',
    );

    // Filter by user ID if provided
    if (userId) {
      qb = qb.andWhere('plan.userId = :userId', { userId });
    }

    // Text search
    if (textSearch) {
      qb = qb.andWhere('plan.name ILIKE :search', {
        search: `%${textSearch}%`,
      });
    }

    // Filters
    if (filter.name) {
      qb = qb.andWhere('plan.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.planType) {
      qb = qb.andWhere('plan.planType = :planType', {
        planType: filter.planType,
      });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('plan.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
