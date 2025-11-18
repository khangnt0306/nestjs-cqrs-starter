import { ICommand } from '@nestjs/cqrs';
import { UpdateDailyTransactionDto } from '@shared/dtos/daily-transactions';

export class UpdateDailyTransactionCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly id: string,
    public readonly dto: UpdateDailyTransactionDto,
  ) {}
}
