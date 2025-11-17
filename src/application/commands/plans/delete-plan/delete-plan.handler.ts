import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlanCommand } from './delete-plan.command';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';

@CommandHandler(DeletePlanCommand)
@Injectable()
export class DeletePlanHandler
  implements ICommandHandler<DeletePlanCommand, void>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(command: DeletePlanCommand): Promise<void> {
    const { planId } = command;

    // Find plan
    const plan = await this.planRepository.findOne({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

    // Delete (Plan entity doesn't extend BaseEntity, so no soft delete)
    await this.planRepository.delete(planId);
  }
}
