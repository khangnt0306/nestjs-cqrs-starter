import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DailyDefaultTransaction } from '@domain/entities/default-transaction/default-transaction.entity';

export interface GetDefaultTransactionsFilter {
  label?: string;
  enabled?: boolean;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class DefaultTransactionRepository extends BaseRepository<DailyDefaultTransaction> {
  constructor(dataSource: DataSource) {
    super(DailyDefaultTransaction, dataSource);
  }

  async findByLabelAndPlanItem(
    label: string,
    planItemId: string,
  ): Promise<DailyDefaultTransaction | null> {
    return this.findOne({
      where: { label, planItemId },
      relations: ['planItem'],
    });
  }

  async findOneByIdAndPlanItem(
    id: string,
    planItemId: string,
  ): Promise<DailyDefaultTransaction | null> {
    return this.findOne({
      where: { id, planItemId },
      relations: ['planItem'],
    });
  }

  async getDefaultTransactionsWithFilters(
    filter: GetDefaultTransactionsFilter,
    paging: PagingOptions,
    planItemId: string,
    textSearch?: string,
  ): Promise<[DailyDefaultTransaction[], number]> {
    let qb = this.createQueryBuilder('defaultTransaction')
      .leftJoinAndSelect('defaultTransaction.planItem', 'planItem')
      .where('defaultTransaction.planItemId = :planItemId', { planItemId });

    // Text search
    if (textSearch) {
      qb = qb.andWhere('defaultTransaction.label ILIKE :search', {
        search: `%${textSearch}%`,
      });
    }

    // Filters
    if (filter.label) {
      qb = qb.andWhere('defaultTransaction.label ILIKE :label', {
        label: `%${filter.label}%`,
      });
    }

    if (filter.enabled !== undefined) {
      qb = qb.andWhere('defaultTransaction.enabled = :enabled', {
        enabled: filter.enabled,
      });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('defaultTransaction.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
