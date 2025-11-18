import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { DailyTransactionResponseDto } from '@shared/dtos/daily-transactions';
import { GetDailyTransactionByIdQuery } from './get-daily-transaction-by-id.query';

@QueryHandler(GetDailyTransactionByIdQuery)
@Injectable()
export class GetDailyTransactionByIdHandler
  implements
    IQueryHandler<GetDailyTransactionByIdQuery, DailyTransactionResponseDto>
{
  constructor(
    private readonly dailyTransactionRepository: DailyTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(
    query: GetDailyTransactionByIdQuery,
  ): Promise<DailyTransactionResponseDto> {
    const { planId, planItemId, id } = query;

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

    return new DailyTransactionResponseDto({
      id: dailyTransaction.id,
      planId: dailyTransaction.planId,
      planItemId: dailyTransaction.planItemId,
      categoryId: dailyTransaction.categoryId,
      type: dailyTransaction.type,
      date: dailyTransaction.date,
      label: dailyTransaction.label,
      amount: dailyTransaction.amount,
      isDefaultGenerated: dailyTransaction.isDefaultGenerated,
      createdAt: dailyTransaction.createdAt,
    });
  }
}

