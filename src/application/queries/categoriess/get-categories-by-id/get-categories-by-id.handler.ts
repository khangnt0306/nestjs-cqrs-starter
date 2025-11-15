import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesByIdQuery } from './get-categories-by-id.query';
import { CategoriesRepository } from '@infrastructure/repositories/categories.repository';
import { CategoriesResponseDto } from '@shared/dtos/categoriess';

@QueryHandler(GetCategoriesByIdQuery)
@Injectable()
export class GetCategoriesByIdHandler
  implements IQueryHandler<GetCategoriesByIdQuery, CategoriesResponseDto>
{
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(query: GetCategoriesByIdQuery): Promise<CategoriesResponseDto> {
    const { categoriesId } = query;

    const categories = await this.categoriesRepository.findOne({
      where: { id: categoriesId },
    });

    if (!categories) {
      throw new NotFoundException(
        `Categories with ID "${categoriesId}" not found`,
      );
    }

    return new CategoriesResponseDto(categories);
  }
}
