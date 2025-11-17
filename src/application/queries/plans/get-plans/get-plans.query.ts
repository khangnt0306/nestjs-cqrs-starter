import { IQuery } from '@nestjs/cqrs';
import { GetPlansQueryDto } from '@shared/dtos/plans';

export class GetPlansQuery implements IQuery {
  constructor(public readonly queryDto: GetPlansQueryDto) {}
}

