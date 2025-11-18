import { ICommand } from '@nestjs/cqrs';

export class DeleteDefaultTransactionCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly id: string,
  ) {}
}
