import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { DailyTransactionResponseDto } from '@shared/dtos/daily-transactions';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { GetDailyTransactionsQuery } from './get-daily-transactions.query';

export class GetDailyTransactionsResponseDto {
  dailyTransactions: DailyTransactionResponseDto[];
  pagination: PaginationResponseDto;

  constructor(
    dailyTransactions: DailyTransactionResponseDto[],
    pagination: PaginationResponseDto,
  ) {
    this.dailyTransactions = dailyTransactions;
    this.pagination = pagination;
  }
}

@QueryHandler(GetDailyTransactionsQuery)
@Injectable()
export class GetDailyTransactionsHandler
  implements
    IQueryHandler<GetDailyTransactionsQuery, GetDailyTransactionsResponseDto>
{
  constructor(
    private readonly dailyTransactionRepository: DailyTransactionRepository,
  ) {}

  async execute(
    query: GetDailyTransactionsQuery,
  ): Promise<GetDailyTransactionsResponseDto> {
    const { planId, planItemId, queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [dailyTransactions, total] =
      await this.dailyTransactionRepository.getDailyTransactionsWithFilters(
        filter,
        { skip, limit },
        planId,
        planItemId,
        textSearch,
      );

    const dailyTransactionDtos = dailyTransactions.map(
      (dt) =>
        new DailyTransactionResponseDto({
          id: dt.id,
          planId: dt.planId,
          planItemId: dt.planItemId,
          categoryId: dt.categoryId,
          type: dt.type,
          date: dt.date,
          label: dt.label,
          amount: dt.amount,
          isDefaultGenerated: dt.isDefaultGenerated,
          createdAt: dt.createdAt,
        }),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetDailyTransactionsResponseDto(
      dailyTransactionDtos,
      pagination,
    );
  }
}

