import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDailyTransactionCommand } from './update-daily-transaction.command';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { DailyTransactionResponseDto } from '@shared/dtos/daily-transactions';

@CommandHandler(UpdateDailyTransactionCommand)
@Injectable()
export class UpdateDailyTransactionHandler
  implements
    ICommandHandler<UpdateDailyTransactionCommand, DailyTransactionResponseDto>
{
  constructor(
    private readonly dailyTransactionRepository: DailyTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(
    command: UpdateDailyTransactionCommand,
  ): Promise<DailyTransactionResponseDto> {
    const { planId, planItemId, id, dto } = command;

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

    // Update fields
    Object.assign(dailyTransaction, dto);

    // Save
    const updated =
      await this.dailyTransactionRepository.save(dailyTransaction);

    // Return response
    return new DailyTransactionResponseDto({
      id: updated.id,
      planId: updated.planId,
      planItemId: updated.planItemId,
      date: updated.date,
      label: updated.label,
      amount: updated.amount,
      createdAt: updated.createdAt,
    });
  }
}
