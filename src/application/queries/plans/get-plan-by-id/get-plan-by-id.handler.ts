import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlanByIdQuery } from './get-plan-by-id.query';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';

@QueryHandler(GetPlanByIdQuery)
@Injectable()
export class GetPlanByIdHandler
  implements IQueryHandler<GetPlanByIdQuery, PlanResponseDto>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(query: GetPlanByIdQuery): Promise<PlanResponseDto> {
    const { planId } = query;

    const plan = await this.planRepository.findOne({
      where: { id: planId },
      relations: ['items'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

    return new PlanResponseDto({
      ...plan,
      items: plan.items?.map((item) => new PlanItemResponseDto(item)) ?? [],
    });
  }
}
