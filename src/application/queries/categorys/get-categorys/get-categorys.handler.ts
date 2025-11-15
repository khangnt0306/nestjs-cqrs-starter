import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategorysQuery } from './get-categorys.query';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CategoryResponseDto } from '@shared/dtos/categorys';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';

export class GetCategorysResponseDto {
  categorys: CategoryResponseDto[];
  pagination: PaginationResponseDto;

  constructor(categorys: CategoryResponseDto[], pagination: PaginationResponseDto) {
    this.categorys = categorys;
    this.pagination = pagination;
  }
}

@QueryHandler(GetCategorysQuery)
@Injectable()
export class GetCategorysHandler
  implements IQueryHandler<GetCategorysQuery, GetCategorysResponseDto>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategorysQuery): Promise<GetCategorysResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [categorys, total] = await this.categoryRepository.getCategorysWithFilters(
      filter,
      { skip, limit },
      textSearch,
    );

    const categoryDtos = categorys.map((category) => new CategoryResponseDto(category));
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetCategorysResponseDto(categoryDtos, pagination);
  }
}

