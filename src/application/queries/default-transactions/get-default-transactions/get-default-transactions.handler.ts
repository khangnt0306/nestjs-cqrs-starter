import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { DefaultTransactionResponseDto } from '@shared/dtos/default-transactions';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { GetDefaultTransactionsQuery } from './get-default-transactions.query';

export class GetDefaultTransactionsResponseDto {
  defaultTransactions: DefaultTransactionResponseDto[];
  pagination: PaginationResponseDto;

  constructor(
    defaultTransactions: DefaultTransactionResponseDto[],
    pagination: PaginationResponseDto,
  ) {
    this.defaultTransactions = defaultTransactions;
    this.pagination = pagination;
  }
}

@QueryHandler(GetDefaultTransactionsQuery)
@Injectable()
export class GetDefaultTransactionsHandler
  implements
    IQueryHandler<
      GetDefaultTransactionsQuery,
      GetDefaultTransactionsResponseDto
    >
{
  constructor(
    private readonly defaultTransactionRepository: DefaultTransactionRepository,
  ) {}

  async execute(
    query: GetDefaultTransactionsQuery,
  ): Promise<GetDefaultTransactionsResponseDto> {
    const { planItemId, queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [defaultTransactions, total] =
      await this.defaultTransactionRepository.getDefaultTransactionsWithFilters(
        filter,
        { skip, limit },
        planItemId,
        textSearch,
      );

    const defaultTransactionDtos = defaultTransactions.map(
      (dt) =>
        new DefaultTransactionResponseDto({
          id: dt.id,
          planItemId: dt.planItemId,
          label: dt.label,
          amount: dt.amount,
          enabled: dt.enabled,
          createdAt: dt.createdAt,
        }),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetDefaultTransactionsResponseDto(
      defaultTransactionDtos,
      pagination,
    );
  }
}
