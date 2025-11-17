import { ICommand } from '@nestjs/cqrs';
import { CreatePlanDto } from '@shared/dtos/plans';

export class CreatePlanCommand implements ICommand {
  constructor(
    public readonly dto: CreatePlanDto,
    public readonly userId: string,
  ) {}
}
