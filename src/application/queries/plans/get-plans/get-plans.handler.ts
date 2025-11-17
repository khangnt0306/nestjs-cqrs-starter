import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlansQuery } from './get-plans.query';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';

export class GetPlansResponseDto {
  plans: PlanResponseDto[];
  pagination: PaginationResponseDto;

  constructor(plans: PlanResponseDto[], pagination: PaginationResponseDto) {
    this.plans = plans;
    this.pagination = pagination;
  }
}

@QueryHandler(GetPlansQuery)
@Injectable()
export class GetPlansHandler
  implements IQueryHandler<GetPlansQuery, GetPlansResponseDto>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(query: GetPlansQuery): Promise<GetPlansResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [plans, total] = await this.planRepository.getPlansWithFilters(
      filter,
      { skip, limit },
      textSearch,
    );

    const planDtos = plans.map(
      (plan) =>
        new PlanResponseDto({
          ...plan,
          items: plan.items?.map((item) => new PlanItemResponseDto(item)) ?? [],
        }),
    );
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetPlansResponseDto(planDtos, pagination);
  }
}
