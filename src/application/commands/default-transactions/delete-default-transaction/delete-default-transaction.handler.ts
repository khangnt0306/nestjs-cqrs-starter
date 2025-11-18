import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDefaultTransactionCommand } from './delete-default-transaction.command';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';

@CommandHandler(DeleteDefaultTransactionCommand)
@Injectable()
export class DeleteDefaultTransactionHandler
  implements ICommandHandler<DeleteDefaultTransactionCommand, void>
{
  constructor(
    private readonly defaultTransactionRepository: DefaultTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(command: DeleteDefaultTransactionCommand): Promise<void> {
    const { planId, planItemId, id } = command;

    // Verify plan item exists and belongs to plan
    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        `Plan item with ID "${planItemId}" not found in plan "${planId}"`,
      );
    }

    // Find default transaction
    const defaultTransaction =
      await this.defaultTransactionRepository.findOneByIdAndPlanItem(
        id,
        planItemId,
      );
    if (!defaultTransaction) {
      throw new NotFoundException(
        `Default transaction with ID "${id}" not found`,
      );
    }

    // Delete
    await this.defaultTransactionRepository.delete(id);
  }
}
