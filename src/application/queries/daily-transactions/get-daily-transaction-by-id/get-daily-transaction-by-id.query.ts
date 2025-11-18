import { IQuery } from '@nestjs/cqrs';

export class GetDailyTransactionByIdQuery implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly id: string,
  ) {}
}

