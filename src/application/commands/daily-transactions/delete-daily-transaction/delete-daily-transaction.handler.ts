import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDailyTransactionCommand } from './delete-daily-transaction.command';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';

@CommandHandler(DeleteDailyTransactionCommand)
@Injectable()
export class DeleteDailyTransactionHandler
  implements ICommandHandler<DeleteDailyTransactionCommand, void>
{
  constructor(
    private readonly dailyTransactionRepository: DailyTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(command: DeleteDailyTransactionCommand): Promise<void> {
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

    // Find daily transaction
    const dailyTransaction =
      await this.dailyTransactionRepository.findOneByIdAndPlanItem(
        id,
        planItemId,
      );
    if (!dailyTransaction) {
      throw new NotFoundException(
        `Daily transaction with ID "${id}" not found`,
      );
    }

    // Delete
    await this.dailyTransactionRepository.delete(id);
  }
}
