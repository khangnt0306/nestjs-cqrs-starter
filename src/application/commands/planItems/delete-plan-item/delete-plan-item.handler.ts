import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlanItemCommand } from './delete-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { buildHttpExceptionResponse } from '@shared/utils';

@CommandHandler(DeletePlanItemCommand)
@Injectable()
export class DeletePlanItemHandler
  implements ICommandHandler<DeletePlanItemCommand, void>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(command: DeletePlanItemCommand): Promise<void> {
    const { planItemId, planId } = command;

    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          'Mục chi tiêu không tồn tại',
        ]),
      );
    }

    await this.planItemRepository.delete(planItemId);

    await this.syncPlanTotalBudget(planId);
  }

  private async syncPlanTotalBudget(planId: string): Promise<void> {
    const totalIncome =
      await this.planItemRepository.calculateIncomeTotal(planId);
    await this.planRepository.update(planId, { totalBudget: totalIncome });
  }
}
