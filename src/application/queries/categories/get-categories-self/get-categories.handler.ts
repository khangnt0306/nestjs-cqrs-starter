import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesSelfQuery } from './get-categories.query';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CategoryResponseDto } from '@shared/dtos/categories';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';

export class GetCategoriesSelfResponseDto {
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

@QueryHandler(GetCategoriesSelfQuery)
@Injectable()
export class GetCategoriesSelfHandler
  implements IQueryHandler<GetCategoriesSelfQuery, GetCategoriesSelfResponseDto>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    query: GetCategoriesSelfQuery,
  ): Promise<GetCategoriesSelfResponseDto> {
    const { queryDto, userId } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    // Get categories: include both self-created and default categories
    const [categories, total] =
      await this.categoryRepository.getSelfCategoriesWithFilters(
        filter,
        { skip, limit },
        textSearch,
        userId,
      );

    const categoryDtos = categories.map(
      (category) =>
        new CategoryResponseDto({
          ...category,
          userId: category.userId,
        }),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetCategoriesSelfResponseDto(categoryDtos, pagination);
  }
}
