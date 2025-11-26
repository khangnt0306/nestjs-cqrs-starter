import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDailyTransactionCommand } from './delete-daily-transaction.command';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { buildHttpExceptionResponse } from '@shared/utils';

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

    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          'Mục chi tiêu không tồn tại trong kế hoạch',
        ]),
      );
    }

    const dailyTransaction =
      await this.dailyTransactionRepository.findOneByIdAndPlanItem(
        id,
        planItemId,
      );
    if (!dailyTransaction) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          'Giao dịch hằng ngày không tồn tại trong mục chi tiêu',
        ]),
      );
    }

    await this.dailyTransactionRepository.delete(id);
  }
}
