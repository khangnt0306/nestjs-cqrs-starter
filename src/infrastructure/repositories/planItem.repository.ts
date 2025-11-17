import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { PlanItem } from '@domain/entities/planItem/planItem.entity';
import { PlanItemType } from '@domain/entities/planItem/planItem.enum';

export interface GetPlanItemsFilter {
  name?: string;
  type?: PlanItemType;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class PlanItemRepository extends BaseRepository<PlanItem> {
  constructor(dataSource: DataSource) {
    super(PlanItem, dataSource);
  }

  async findByName(name: string, planId: string): Promise<PlanItem | null> {
    return this.findOne({ where: { name, planId } });
  }

  async findOneByIdAndPlan(
    planItemId: string,
    planId: string,
  ): Promise<PlanItem | null> {
    return this.findOne({ where: { id: planItemId, planId } });
  }

  async getPlanItemsWithFilters(
    filter: GetPlanItemsFilter,
    paging: PagingOptions,
    planId: string,
    textSearch?: string,
  ): Promise<[PlanItem[], number]> {
    let qb = this.createQueryBuilder('planItem').where(
      'planItem.planId = :planId',
      { planId },
    );

    // Text search
    if (textSearch) {
      qb = qb.andWhere('planItem.name ILIKE :search', {
        search: `%${textSearch}%`,
      });
    }

    // Filters
    if (filter.name) {
      qb = qb.andWhere('planItem.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.type) {
      qb = qb.andWhere('planItem.type = :type', {
        type: filter.type,
      });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('planItem.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
