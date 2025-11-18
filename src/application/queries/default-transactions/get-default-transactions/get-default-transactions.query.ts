import { GetDefaultTransactionsQueryDto } from '@shared/dtos/default-transactions';
import { IQuery } from '@nestjs/cqrs';

export class GetDefaultTransactionsQuery implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly queryDto: GetDefaultTransactionsQueryDto,
  ) {}
}
