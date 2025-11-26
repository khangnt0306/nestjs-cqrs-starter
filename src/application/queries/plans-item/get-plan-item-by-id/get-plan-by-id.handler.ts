import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { GetPlanItemByIdQuery } from './get-plan-by-id.query';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { createPlanItemResponseDto } from '@shared/utils/plan-item-response.helper';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';

@QueryHandler(GetPlanItemByIdQuery)
@Injectable()
export class GetPlanItemByIdHandler
  implements IQueryHandler<GetPlanItemByIdQuery, PlanItemResponseDto>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
    private readonly dailyTransactionRepository: DailyTransactionRepository,
  ) {}

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

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

    const spentAmount =
      await this.dailyTransactionRepository.getTotalAmountByPlanItem(
        planItemId,
      );

    return createPlanItemResponseDto(
      planItem,
      plan,
      this.planCalculationService,
      { spentAmount },
    );
  }
}
