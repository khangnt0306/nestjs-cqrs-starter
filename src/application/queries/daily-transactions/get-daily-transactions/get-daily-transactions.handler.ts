import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import {
  DailyTransactionResponseDto,
  DailyTransactionsByDateDto,
} from '@shared/dtos/daily-transactions';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { GetDailyTransactionsQuery } from './get-daily-transactions.query';

export class GetDailyTransactionsResponseDto {
  days: DailyTransactionsByDateDto[];
  pagination: PaginationResponseDto;

  constructor(
    days: DailyTransactionsByDateDto[],
    pagination: PaginationResponseDto,
  ) {
    this.days = days;
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
          date: dt.date,
          label: dt.label,
          amount: dt.amount,
          createdAt: dt.createdAt,
        }),
    );

    const grouped: DailyTransactionsByDateDto[] = [];
    const dateMap = new Map<string, DailyTransactionResponseDto[]>();

    for (const dto of dailyTransactionDtos) {
      let list = dateMap.get(dto.date);
      if (!list) {
        list = [];
        dateMap.set(dto.date, list);
        grouped.push(
          new DailyTransactionsByDateDto({
            date: dto.date,
            transactions: list,
          }),
        );
      }
      list.push(dto);
    }
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetDailyTransactionsResponseDto(grouped, pagination);
  }
}
