import { ICommand } from '@nestjs/cqrs';
import { UpdatePlanItemDto } from '@shared/dtos/plansItem';

export class UpdatePlanItemCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
    public readonly dto: UpdatePlanItemDto,
  ) {}
}
