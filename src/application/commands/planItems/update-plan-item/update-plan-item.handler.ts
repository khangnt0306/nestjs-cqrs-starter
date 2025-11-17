import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanItemCommand } from './update-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';

@CommandHandler(UpdatePlanItemCommand)
@Injectable()
export class UpdatePlanItemHandler
  implements ICommandHandler<UpdatePlanItemCommand, PlanItemResponseDto>
{
  constructor(private readonly planItemRepository: PlanItemRepository) {}

  async execute(command: UpdatePlanItemCommand): Promise<PlanItemResponseDto> {
    const { planItemId, dto, planId } = command;

    // Find plan item
    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        `Plan item with ID "${planItemId}" not found in this plan`,
      );
    }

    // Check name duplicate if name is changed
    if (dto.name && dto.name !== planItem.name) {
      const existingPlanItem = await this.planItemRepository.findByName(
        dto.name,
        planId,
      );
      if (existingPlanItem) {
        throw new ConflictException(
          `Plan item with name "${dto.name}" already exists in this plan`,
        );
      }
    }

    // Update fields
    Object.assign(planItem, dto);

    // Save
    const updatedPlanItem = await this.planItemRepository.save(planItem);

    // Return response
    return new PlanItemResponseDto(updatedPlanItem);
  }
}
