import { GetDailyTransactionsQueryDto } from '@shared/dtos/daily-transactions';
import { IQuery } from '@nestjs/cqrs';

export class GetDailyTransactionsQuery implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly queryDto: GetDailyTransactionsQueryDto,
  ) {}
}
