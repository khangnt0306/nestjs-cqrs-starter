import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlanItemCommand } from './create-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { buildHttpExceptionResponse } from '@shared/utils';
import {
  EXCLUDE_TYPE,
  PlanItemType,
} from '@domain/entities/planItem/planItem.enum';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { createPlanItemResponseDto } from '@shared/utils/plan-item-response.helper';

@CommandHandler(CreatePlanItemCommand)
@Injectable()
export class CreatePlanItemHandler
  implements ICommandHandler<CreatePlanItemCommand, PlanItemResponseDto>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
  ) {}

  async execute(command: CreatePlanItemCommand): Promise<PlanItemResponseDto> {
    const { dto, planId } = command;

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

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

    if (
      dto.minimumPercentage !== undefined &&
      (dto.excludeType !== EXCLUDE_TYPE.FLEXIBLE ||
        dto.type !== PlanItemType.EXPENSE)
    ) {
      throw new BadRequestException(
        buildHttpExceptionResponse(HttpStatus.BAD_REQUEST, [
          'Tỷ lệ tối thiểu chỉ áp dụng cho chi tiêu loại linh hoạt',
        ]),
      );
    }

    const planItem = this.planItemRepository.create({
      planId,
      name: dto.name,
      amount: dto.amount,
      description: dto.description,
      excludeType: dto.excludeType,
      type: dto.type,
      categoryId: dto.categoryId,
      minimumPercentage: dto.minimumPercentage,
    });

    const savedPlanItem = await this.planItemRepository.save(planItem);

    await this.syncPlanTotalBudget(planId);

    return createPlanItemResponseDto(
      savedPlanItem,
      plan,
      this.planCalculationService,
      { spentAmount: 0 },
    );
  }

  private async syncPlanTotalBudget(planId: string): Promise<void> {
    const totalIncome =
      await this.planItemRepository.calculateIncomeTotal(planId);
    await this.planRepository.update(planId, { totalBudget: totalIncome });
  }
}
