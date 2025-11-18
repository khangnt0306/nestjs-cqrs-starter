import { ICommand } from '@nestjs/cqrs';
import { CreateDefaultTransactionDto } from '@shared/dtos/default-transactions';

export class CreateDefaultTransactionCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly dto: CreateDefaultTransactionDto,
  ) {}
}
