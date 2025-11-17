import { IQuery } from '@nestjs/cqrs';

export class GetPlanByIdQuery implements IQuery {
  constructor(public readonly planId: string) {}
}
