import { IQuery } from '@nestjs/cqrs';
import { GetPlanItemsQueryDto } from '@shared/dtos/plansItem';

export class GetPlanItemsSelfQuery implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly queryDto: GetPlanItemsQueryDto,
    public readonly userId: string,
  ) {}
}
