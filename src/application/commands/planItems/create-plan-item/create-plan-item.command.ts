import { ICommand } from '@nestjs/cqrs';
import { CreatePlanItemDto } from '@shared/dtos/plansItem';

export class CreatePlanItemCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly dto: CreatePlanItemDto,
  ) {}
}
