import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanCommand } from './update-plan.command';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';

@CommandHandler(UpdatePlanCommand)
@Injectable()
export class UpdatePlanHandler
  implements ICommandHandler<UpdatePlanCommand, PlanResponseDto>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(command: UpdatePlanCommand): Promise<PlanResponseDto> {
    const { planId, dto } = command;

    // Find plan
    const plan = await this.planRepository.findOne({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException(
        `Plan with ID "${planId}" not found`,
      );
    }

    // Check name duplicate if name is changed
    if (dto.name && dto.name !== plan.name) {
      const existingPlan = await this.planRepository.findByName(dto.name);
      if (existingPlan) {
        throw new ConflictException(
          `Plan with name "${dto.name}" already exists`,
        );
      }
    }

    // Update fields
    Object.assign(plan, dto);

    // Save
    const updatedPlan = await this.planRepository.save(plan);

    // Return response
    return new PlanResponseDto(updatedPlan);
  }
}

