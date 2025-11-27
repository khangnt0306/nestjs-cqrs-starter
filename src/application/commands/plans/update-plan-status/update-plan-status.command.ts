import { ICommand } from '@nestjs/cqrs';
import { PlanStatus } from '@domain/entities/plan/plan.enum';

export class UpdatePlanStatusCommand implements ICommand {
  constructor(
    public readonly planId: string,
    public readonly status: PlanStatus,
  ) {}
}
