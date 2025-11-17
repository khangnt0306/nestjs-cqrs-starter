import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlanItemsSelfQuery } from './get-plan-item.query';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';

export class GetPlanItemsSelfResponseDto {
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

@QueryHandler(GetPlanItemsSelfQuery)
@Injectable()
export class GetPlanItemsSelfHandler
  implements IQueryHandler<GetPlanItemsSelfQuery, GetPlanItemsSelfResponseDto>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(
    query: GetPlanItemsSelfQuery,
  ): Promise<GetPlanItemsSelfResponseDto> {
    const { queryDto, userId, planId } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const plan = await this.planRepository.findOne({
      where: { id: planId, userId },
    });
    if (!plan) {
      throw new NotFoundException(
        `Plan with ID "${planId}" not found for current user`,
      );
    }

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

    return new GetPlanItemsSelfResponseDto(planItemDtos, pagination);
  }
}
