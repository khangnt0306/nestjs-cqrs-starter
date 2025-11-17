import { IQuery } from '@nestjs/cqrs';
import { GetCategoriesQueryDto } from '@shared/dtos/categories';
export class GetCategoriesSelfQuery implements IQuery {
  constructor(
    public readonly queryDto: GetCategoriesQueryDto,
    public readonly userId: string,
  ) {}
}
