import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DailyTransaction } from '@domain/entities/daily-transaction/daily-transaction.entity';
import { TransactionType } from '@domain/entities/daily-transaction/daily-transaction.entity';

export interface GetDailyTransactionsFilter {
  label?: string;
  type?: TransactionType;
  date?: string;
  isDefaultGenerated?: boolean;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class DailyTransactionRepository extends BaseRepository<DailyTransaction> {
  constructor(dataSource: DataSource) {
    super(DailyTransaction, dataSource);
  }

  async findOneByIdAndPlanItem(
    id: string,
    planItemId: string,
  ): Promise<DailyTransaction | null> {
    return this.findOne({
      where: { id, planItemId },
      relations: ['plan', 'planItem', 'category'],
    });
  }

  async getDailyTransactionsWithFilters(
    filter: GetDailyTransactionsFilter,
    paging: PagingOptions,
    planId: string,
    planItemId: string,
    textSearch?: string,
  ): Promise<[DailyTransaction[], number]> {
    let qb = this.createQueryBuilder('dailyTransaction')
      .leftJoinAndSelect('dailyTransaction.plan', 'plan')
      .leftJoinAndSelect('dailyTransaction.planItem', 'planItem')
      .leftJoinAndSelect('dailyTransaction.category', 'category')
      .where('dailyTransaction.planId = :planId', { planId })
      .andWhere('dailyTransaction.planItemId = :planItemId', { planItemId });

    // Text search
    if (textSearch) {
      qb = qb.andWhere('dailyTransaction.label ILIKE :search', {
        search: `%${textSearch}%`,
      });
    }

    // Filters
    if (filter.label) {
      qb = qb.andWhere('dailyTransaction.label ILIKE :label', {
        label: `%${filter.label}%`,
      });
    }

    if (filter.type) {
      qb = qb.andWhere('dailyTransaction.type = :type', {
        type: filter.type,
      });
    }

    if (filter.date) {
      qb = qb.andWhere('dailyTransaction.date = :date', {
        date: filter.date,
      });
    }

    if (filter.isDefaultGenerated !== undefined) {
      qb = qb.andWhere(
        'dailyTransaction.isDefaultGenerated = :isDefaultGenerated',
        {
          isDefaultGenerated: filter.isDefaultGenerated,
        },
      );
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb
      .orderBy('dailyTransaction.date', 'DESC')
      .addOrderBy('dailyTransaction.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
