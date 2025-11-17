import { Injectable, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlanCommand } from './create-plan.command';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';

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
        `Plan with name "${dto.name}" already exists`,
      );
    }

    // Create entity
    const plan = this.planRepository.create({
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      repeatType: dto.repeatType,
      autoAdjustEnabled: dto.autoAdjustEnabled ?? true,
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
