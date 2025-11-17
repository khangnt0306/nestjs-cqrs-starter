import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { GetPlanItemByIdQuery } from './get-plan-by-id.query';

@QueryHandler(GetPlanItemByIdQuery)
@Injectable()
export class GetPlanItemByIdHandler
  implements IQueryHandler<GetPlanItemByIdQuery, PlanItemResponseDto>
{
  constructor(private readonly planItemRepository: PlanItemRepository) {}

  async execute(query: GetPlanItemByIdQuery): Promise<PlanItemResponseDto> {
    const { planItemId, planId } = query;

    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );

    if (!planItem) {
      throw new NotFoundException(
        `Plan item with ID "${planItemId}" not found in this plan`,
      );
    }

    return new PlanItemResponseDto(planItem);
  }
}
