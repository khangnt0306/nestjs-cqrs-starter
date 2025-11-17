import { IQuery } from '@nestjs/cqrs';
import { GetPlansQueryDto } from '@shared/dtos/plans';

export class GetPlansSelfQuery implements IQuery {
  constructor(
    public readonly queryDto: GetPlansQueryDto,
    public readonly userId: string,
  ) {}
}
