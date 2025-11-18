import { ICommand } from '@nestjs/cqrs';
import { CreateDailyTransactionDto } from '@shared/dtos/daily-transactions';

export class CreateDailyTransactionCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly dto: CreateDailyTransactionDto,
  ) {}
}
