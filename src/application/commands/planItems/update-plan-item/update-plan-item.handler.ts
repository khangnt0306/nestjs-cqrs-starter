import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanItemCommand } from './update-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { buildHttpExceptionResponse } from '@shared/utils';
import {
  EXCLUDE_TYPE,
  PlanItemType,
} from '@domain/entities/planItem/planItem.enum';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { createPlanItemResponseDto } from '@shared/utils/plan-item-response.helper';

@CommandHandler(UpdatePlanItemCommand)
@Injectable()
export class UpdatePlanItemHandler
  implements ICommandHandler<UpdatePlanItemCommand, PlanItemResponseDto>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
    private readonly dailyTransactionRepository: DailyTransactionRepository,
  ) {}

  async execute(command: UpdatePlanItemCommand): Promise<PlanItemResponseDto> {
    const { planItemId, dto, planId } = command;

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

    if (dto.name && dto.name !== planItem.name) {
      const existingPlanItem = await this.planItemRepository.findByName(
        dto.name,
        planId,
      );
      if (existingPlanItem) {
        throw new ConflictException(
          buildHttpExceptionResponse(HttpStatus.CONFLICT, [
            'Tên mục chi tiêu đã tồn tại',
          ]),
        );
      }
    }

    // Validate: minimumPercentage chỉ được phép khi excludeType = FLEXIBLE và type = EXPENSE
    const finalExcludeType = dto.excludeType ?? planItem.excludeType;
    const finalType = dto.type ?? planItem.type;
    if (
      dto.minimumPercentage !== undefined &&
      (finalExcludeType !== EXCLUDE_TYPE.FLEXIBLE ||
        finalType !== PlanItemType.EXPENSE)
    ) {
      throw new BadRequestException(
        buildHttpExceptionResponse(HttpStatus.BAD_REQUEST, [
          'Tỷ lệ tối thiểu chỉ áp dụng cho chi tiêu loại linh hoạt',
        ]),
      );
    }

    // Xóa minimumPercentage nếu:
    // - Đổi từ FLEXIBLE sang FIXED
    // - Đổi từ EXPENSE sang INCOME
    // - Đổi từ FLEXIBLE EXPENSE sang FLEXIBLE INCOME
    if (
      (planItem.excludeType === EXCLUDE_TYPE.FLEXIBLE &&
        dto.excludeType === EXCLUDE_TYPE.FIXED) ||
      (planItem.type === PlanItemType.EXPENSE &&
        dto.type === PlanItemType.INCOME) ||
      (planItem.excludeType === EXCLUDE_TYPE.FLEXIBLE &&
        planItem.type === PlanItemType.EXPENSE &&
        dto.type === PlanItemType.INCOME)
    ) {
      planItem.minimumPercentage = undefined;
    }

    Object.assign(planItem, dto);

    const updatedPlanItem = await this.planItemRepository.save(planItem);

    await this.syncPlanTotalBudget(planId);

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          'Kế hoạch không tồn tại',
        ]),
      );
    }

    const spentAmount =
      await this.dailyTransactionRepository.getTotalAmountByPlanItem(
        planItemId,
      );

    return createPlanItemResponseDto(
      updatedPlanItem,
      plan,
      this.planCalculationService,
      { spentAmount },
    );
  }

  private async syncPlanTotalBudget(planId: string): Promise<void> {
    const totalIncome =
      await this.planItemRepository.calculateIncomeTotal(planId);
    await this.planRepository.update(planId, { totalBudget: totalIncome });
  }
}
