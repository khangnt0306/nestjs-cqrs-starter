import { IQuery } from '@nestjs/cqrs';

export class GetPlanItemByIdQuery implements IQuery {
  constructor(
    public readonly planId: string,
    public readonly planItemId: string,
  ) {}
}
