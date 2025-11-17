import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { PlanItemResponseDto } from '@app/shared/dtos/plansItem';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { GetPlanItemCommand } from './get-plan-item.query';

export class GetPlanItemResponseDto {
  planItems: PlanItemResponseDto[];
  pagination: PaginationResponseDto;

  constructor(
    planItems: PlanItemResponseDto[],
    pagination: PaginationResponseDto,
  ) {
    this.planItems = planItems;
    this.pagination = pagination;
  }
}

@QueryHandler(GetPlanItemCommand)
@Injectable()
export class GetPlanItemHandler
  implements IQueryHandler<GetPlanItemCommand, GetPlanItemResponseDto>
{
  constructor(private readonly planItemRepository: PlanItemRepository) {}

  async execute(query: GetPlanItemCommand): Promise<GetPlanItemResponseDto> {
    const { queryDto, planId } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [planItems, total] =
      await this.planItemRepository.getPlanItemsWithFilters(
        filter,
        { skip, limit },
        planId,
        textSearch,
      );

    const planItemDtos = planItems.map(
      (planItem) => new PlanItemResponseDto(planItem),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetPlanItemResponseDto(planItemDtos, pagination);
  }
}
