import { ICommand } from '@nestjs/cqrs';

export class DeletePlanItemCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
  ) {}
}
