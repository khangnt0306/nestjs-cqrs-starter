import { ICommand } from '@nestjs/cqrs';
import { UpdatePlanDto } from '@shared/dtos/plans';

export class UpdatePlanCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly dto: UpdatePlanDto,
  ) {}
}

