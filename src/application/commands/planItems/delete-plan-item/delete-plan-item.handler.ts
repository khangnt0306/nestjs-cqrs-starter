import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlanItemCommand } from './delete-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';

@CommandHandler(DeletePlanItemCommand)
@Injectable()
export class DeletePlanItemHandler
  implements ICommandHandler<DeletePlanItemCommand, void>
{
  constructor(private readonly planItemRepository: PlanItemRepository) {}

  async execute(command: DeletePlanItemCommand): Promise<void> {
    const { planItemId, planId } = command;

    // Find plan
    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        `Plan item with ID "${planItemId}" not found in this plan`,
      );
    }

    // Delete (Plan entity doesn't extend BaseEntity, so no soft delete)
    await this.planItemRepository.delete(planItemId);
  }
}
