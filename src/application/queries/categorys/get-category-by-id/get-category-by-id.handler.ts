import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryByIdQuery } from './get-category-by-id.query';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CategoryResponseDto } from '@shared/dtos/categorys';

@QueryHandler(GetCategoryByIdQuery)
@Injectable()
export class GetCategoryByIdHandler
  implements IQueryHandler<GetCategoryByIdQuery, CategoryResponseDto>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryByIdQuery): Promise<CategoryResponseDto> {
    const { categoryId } = query;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID "${categoryId}" not found`,
      );
    }

    return new CategoryResponseDto(category);
  }
}

