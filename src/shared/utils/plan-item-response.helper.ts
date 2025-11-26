import { PlanItem } from '@domain/entities/planItem/planItem.entity';
import { Plan } from '@domain/entities/plan/plan.entity';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import {
  EXCLUDE_TYPE,
  PlanItemType,
} from '@domain/entities/planItem/planItem.enum';

interface PlanItemResponseOptions {
  referenceDate?: Date | string;
  spentAmount?: number;
}

/**
 * Helper function to create PlanItemResponseDto with calculated averageDaily for FLEXIBLE items
 */
export function createPlanItemResponseDto(
  planItem: PlanItem,
  plan: Plan,
  planCalculationService: PlanCalculationService,
  options: PlanItemResponseOptions = {},
): PlanItemResponseDto {
  const dto = new PlanItemResponseDto(planItem);
  const referenceDate = options.referenceDate ?? new Date();
  const spentAmount = options.spentAmount ?? 0;

  // Calculate averageDaily for FLEXIBLE items
  if (
    planItem.excludeType === EXCLUDE_TYPE.FLEXIBLE &&
    planItem.type === PlanItemType.EXPENSE
  ) {
    const totalAmount = Number(planItem.amount ?? 0);
    const remainingAmount = Math.max(totalAmount - spentAmount, 0);
    dto.spentAmount = spentAmount;
    dto.savedAmount = remainingAmount;
    dto.averageDaily = planCalculationService.calculateDailyAverage(
      remainingAmount,
      plan.planType,
      referenceDate,
    );
  }
  return dto;
}
