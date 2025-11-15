import { IQuery } from '@nestjs/cqrs';
import { GetCategorysQueryDto } from '@shared/dtos/categorys';

export class GetCategorysQuery implements IQuery {
  constructor(public readonly queryDto: GetCategorysQueryDto) {}
}

