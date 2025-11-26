import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlansSelfQuery } from './get-plans.query';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { createPlanItemResponseDto } from '@shared/utils/plan-item-response.helper';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';

export class GetPlansSelfResponseDto {
  plans: PlanResponseDto[];
  pagination: PaginationResponseDto;

  constructor(plans: PlanResponseDto[], pagination: PaginationResponseDto) {
    this.plans = plans;
    this.pagination = pagination;
  }
}

@QueryHandler(GetPlansSelfQuery)
@Injectable()
export class GetPlansSelfHandler
  implements IQueryHandler<GetPlansSelfQuery, GetPlansSelfResponseDto>
{
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
    private readonly dailyTransactionRepository: DailyTransactionRepository,
  ) {}

  async execute(query: GetPlansSelfQuery): Promise<GetPlansSelfResponseDto> {
    const { queryDto, userId } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [plans, total] = await this.planRepository.getPlansWithFilters(
      filter,
      { skip, limit },
      textSearch,
      userId,
    );

    const planItemIds = plans
      .flatMap((plan) => plan.items ?? [])
      .map((item) => item.id);

    const spentMap =
      await this.dailyTransactionRepository.getTotalsByPlanItemIds(planItemIds);

    const planDtos = plans.map(
      (plan) =>
        new PlanResponseDto({
          ...plan,
          items:
            plan.items?.map((item) =>
              createPlanItemResponseDto(
                item,
                plan,
                this.planCalculationService,
                { spentAmount: spentMap[item.id] ?? 0 },
              ),
            ) ?? [],
        }),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetPlansSelfResponseDto(planDtos, pagination);
  }
}
