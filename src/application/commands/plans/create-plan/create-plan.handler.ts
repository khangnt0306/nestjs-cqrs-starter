import { Injectable, ConflictException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlanCommand } from './create-plan.command';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { buildHttpExceptionResponse } from '@shared/utils';
import { PlanStatus, PlanType } from '@domain/entities/plan/plan.enum';

@CommandHandler(CreatePlanCommand)
@Injectable()
export class CreatePlanHandler
  implements ICommandHandler<CreatePlanCommand, PlanResponseDto>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(command: CreatePlanCommand): Promise<PlanResponseDto> {
    const { dto, userId } = command;

    // Validate business rules
    const existingPlan = await this.planRepository.findByName(dto.name);
    if (existingPlan) {
      throw new ConflictException(
        buildHttpExceptionResponse(HttpStatus.CONFLICT, [
          'Tên kế hoạch đã tồn tại',
        ]),
      );
    }

    // Create entity
    const plan = this.planRepository.create({
      name: dto.name,
      planType: dto.planType ?? PlanType.MONTHLY,
      autoRepeat: dto.autoRepeat ?? false,
      autoAdjustEnabled: dto.autoAdjustEnabled ?? true,
      description: dto.description,
      currency: dto.currency || process.env.DEFAULT_PLAN_CURRENCY || 'VND',
      totalBudget: 0,
      status: PlanStatus.INACTIVE,
      dailyMinLimit: dto.dailyMinLimit,
      warnLevelYellow: dto.warnLevelYellow,
      warnLevelRed: dto.warnLevelRed,
      userId, // Set userId from authenticated user
    });

    // Save to database
    const savedPlan = await this.planRepository.save(plan);

    // Return response
    return new PlanResponseDto(savedPlan);
  }
}
