import { IQuery } from '@nestjs/cqrs';
import { GetCategoriesQueryDto } from '@shared/dtos/categories';
export class GetCategoriesQuery implements IQuery {
  constructor(public readonly queryDto: GetCategoriesQueryDto) {}
}
