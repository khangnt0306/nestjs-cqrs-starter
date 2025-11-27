import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlanByIdQuery } from './get-plan-by-id.query';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { createPlanItemResponseDto } from '@shared/utils/plan-item-response.helper';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { buildHttpExceptionResponse } from '@app/shared/utils/http-exception-response.util';

@QueryHandler(GetPlanByIdQuery)
@Injectable()
export class GetPlanByIdHandler
  implements IQueryHandler<GetPlanByIdQuery, PlanResponseDto>
{
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
    private readonly dailyTransactionRepository: DailyTransactionRepository,
  ) {}

  async execute(query: GetPlanByIdQuery): Promise<PlanResponseDto> {
    const { planId } = query;

    const plan = await this.planRepository.findOne({
      where: { id: planId },
      relations: ['items'],
    });

    if (!plan) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          `Kế hoạch với ID "${planId}" không tồn tại`,
        ]),
      );
    }

    const planItemIds = plan.items?.map((item) => item.id) ?? [];
    const spentMap =
      await this.dailyTransactionRepository.getTotalsByPlanItemIds(planItemIds);

    return new PlanResponseDto({
      ...plan,
      totalIncome: this.planCalculationService.totalIncomeForPlanType(
        plan.items ?? [],
      ),
      totalExpense: this.planCalculationService.totalExpenseForPlanType(
        plan.items ?? [],
      ),
      items:
        plan.items?.map((item) =>
          createPlanItemResponseDto(item, plan, this.planCalculationService, {
            spentAmount: spentMap[item.id] ?? 0,
          }),
        ) ?? [],
    });
  }
}
