import { ICommand } from '@nestjs/cqrs';
import { UpdateDefaultTransactionDto } from '@shared/dtos/default-transactions';

export class UpdateDefaultTransactionCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly id: string,
    public readonly dto: UpdateDefaultTransactionDto,
  ) {}
}
