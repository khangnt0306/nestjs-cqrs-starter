import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDailyTransactionCommand } from './create-daily-transaction.command';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { DailyTransactionResponseDto } from '@shared/dtos/daily-transactions';

@CommandHandler(CreateDailyTransactionCommand)
@Injectable()
export class CreateDailyTransactionHandler
  implements
    ICommandHandler<CreateDailyTransactionCommand, DailyTransactionResponseDto>
{
  constructor(
    private readonly dailyTransactionRepository: DailyTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(
    command: CreateDailyTransactionCommand,
  ): Promise<DailyTransactionResponseDto> {
    const { planId, planItemId, dto } = command;

    // Verify plan exists
    const plan = await this.planRepository.findOne({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

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

    // Create entity
    const dailyTransaction = this.dailyTransactionRepository.create({
      label: dto.label,
      amount: dto.amount,
      date: dto.date,
      type: dto.type,
      planId: plan.id,
      plan: plan,
      planItemId: planItem.id,
      planItem: planItem,
      categoryId: dto.categoryId,
      isDefaultGenerated: dto.isDefaultGenerated ?? false,
    });

    // Save to database
    const saved = await this.dailyTransactionRepository.save(dailyTransaction);

    // Return response
    return new DailyTransactionResponseDto({
      id: saved.id,
      planId: saved.planId,
      planItemId: saved.planItemId,
      categoryId: saved.categoryId,
      type: saved.type,
      date: saved.date,
      label: saved.label,
      amount: saved.amount,
      isDefaultGenerated: saved.isDefaultGenerated,
      createdAt: saved.createdAt,
    });
  }
}
