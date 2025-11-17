import { GetPlanItemsQueryDto } from '@app/shared/dtos/plansItem';
import { IQuery } from '@nestjs/cqrs';

export class GetPlanItemCommand implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly queryDto: GetPlanItemsQueryDto,
  ) {}
}
