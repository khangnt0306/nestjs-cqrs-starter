import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './get-categories.query';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CategoryResponseDto } from '@shared/dtos/categories';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';

export class GetCategoriesResponseDto {
  categories: CategoryResponseDto[];
  pagination: PaginationResponseDto;

  constructor(
    categories: CategoryResponseDto[],
    pagination: PaginationResponseDto,
  ) {
    this.categories = categories;
    this.pagination = pagination;
  }
}

@QueryHandler(GetCategoriesQuery)
@Injectable()
export class GetCategoriesHandler
  implements IQueryHandler<GetCategoriesQuery, GetCategoriesResponseDto>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoriesQuery): Promise<GetCategoriesResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [categories, total] =
      await this.categoryRepository.getCategoriesWithFilters(
        filter,
        { skip, limit },
        textSearch,
      );

    const categoryDtos = categories.map(
      (category) => new CategoryResponseDto(category),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetCategoriesResponseDto(categoryDtos, pagination);
  }
}
