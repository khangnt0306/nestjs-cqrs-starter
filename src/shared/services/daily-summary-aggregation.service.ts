import { Injectable } from '@nestjs/common';
import { DailySummaryRepository } from '@infrastructure/repositories/daily-summary.repository';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanCalculationService } from './plan-calculation.service';
import { DefaultTransactionAutoGeneratorService } from './default-transaction-auto-generator.service';
import {
  EXCLUDE_TYPE,
  PlanItemType,
} from '@domain/entities/planItem/planItem.enum';
import { DailyStatus } from '@domain/entities/daily-summary/daily-summary.entity';
import { PlanStatus } from '@domain/entities/plan/plan.enum';

@Injectable()
export class DailySummaryAggregationService {
  constructor(
    private readonly dailySummaryRepository: DailySummaryRepository,
    private readonly dailyTransactionRepository: DailyTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
    private readonly planCalculationService: PlanCalculationService,
    private readonly defaultTransactionAutoGenerator: DefaultTransactionAutoGeneratorService,
  ) {}

  /**
   * Tổng hợp daily summary cho một plan vào cuối ngày
   * @param planId ID của plan
   * @param date Ngày cần tổng hợp (format: YYYY-MM-DD)
   */
  async aggregateDailySummary(planId: string, date: string): Promise<void> {
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      return;
    }

    // Bước 1: Tự động tạo daily transaction từ default transaction cho FLEXIBLE items
    // Chỉ tạo nếu chưa có transaction thủ công
    await this.defaultTransactionAutoGenerator.generateDailyTransactionsForPlan(
      planId,
      date,
    );

    // Get or create daily summary
    const summary = await this.dailySummaryRepository.findOrCreateByPlanAndDate(
      planId,
      date,
    );

    // Get all transactions for this plan on this date
    // Bao gồm cả transaction thủ công và tự động từ default
    const transactions = await this.dailyTransactionRepository.find({
      where: { planId, date },
    });

    // Calculate totals
    let totalActualIncome = 0;
    let totalActualExpense = 0;
    let totalPlannedIncome = 0;
    let totalPlannedExpense = 0;

    // Get all plan items for this plan
    const planItems = await this.planItemRepository.find({
      where: { planId },
    });

    // Calculate planned amounts from plan items
    for (const item of planItems) {
      const dailyAverage = this.planCalculationService.calculateDailyAverage(
        parseFloat(item.amount.toString()),
        plan.planType,
        date,
      );

      if (item.type === PlanItemType.INCOME) {
        totalPlannedIncome += dailyAverage;
      } else {
        totalPlannedExpense += dailyAverage;
      }
    }

    // Calculate actual amounts from transactions
    for (const transaction of transactions) {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        totalActualIncome += amount;
      } else {
        totalActualExpense += amount;
      }
    }

    // Handle FLEXIBLE items: check minimum thresholds
    let isBelowMinimum = false;
    let flexibleAverageAmount: number | undefined;
    let flexibleMinimumThreshold: number | undefined;

    for (const item of planItems) {
      // Chỉ áp dụng minimumPercentage cho chi tiêu (EXPENSE) loại FLEXIBLE
      if (
        item.excludeType === EXCLUDE_TYPE.FLEXIBLE &&
        item.type === PlanItemType.EXPENSE &&
        item.minimumPercentage
      ) {
        const dailyAverage = this.planCalculationService.calculateDailyAverage(
          parseFloat(item.amount.toString()),
          plan.planType,
          date,
        );

        const dailyMinimum = this.planCalculationService.calculateDailyMinimum(
          dailyAverage,
          item.minimumPercentage,
        );

        // Get total actual amount for this plan item on this date
        // Logic:
        // - Nếu có transaction thủ công (isDefaultGenerated = false) → dùng nó
        // - Nếu không có transaction thủ công → dùng transaction tự động từ default
        // - Nếu không có cả hai → tính là 0
        const itemTransactions = transactions.filter(
          (t) => t.planItemId === item.id,
        );

        // Ưu tiên transaction thủ công nếu có
        const manualTransactions = itemTransactions.filter(
          (t) => !t.isDefaultGenerated,
        );
        const transactionsToUse =
          manualTransactions.length > 0 ? manualTransactions : itemTransactions; // Nếu không có thủ công, dùng auto

        const itemActualAmount = transactionsToUse.reduce(
          (sum, t) => sum + parseFloat(t.amount),
          0,
        );

        // Check if below minimum
        if (
          this.planCalculationService.isBelowMinimum(
            itemActualAmount,
            dailyMinimum,
          )
        ) {
          isBelowMinimum = true;
        }

        // Store flexible info (use first flexible item's values for summary)
        if (!flexibleAverageAmount) {
          flexibleAverageAmount = dailyAverage;
          flexibleMinimumThreshold = dailyMinimum;
        }
      }
    }

    // Determine status
    let status = DailyStatus.OK;
    if (isBelowMinimum) {
      status = DailyStatus.WARNING;
    } else if (totalActualExpense > totalPlannedExpense) {
      status = DailyStatus.EXCEED;
    }

    // Update summary
    summary.totalPlannedIncome = totalPlannedIncome.toString();
    summary.totalActualIncome = totalActualIncome.toString();
    summary.totalPlannedExpense = totalPlannedExpense.toString();
    summary.totalActualExpense = totalActualExpense.toString();
    summary.status = status;
    summary.isBelowMinimum = isBelowMinimum;

    if (flexibleAverageAmount !== undefined) {
      summary.flexibleAverageAmount = flexibleAverageAmount.toString();
    }
    if (flexibleMinimumThreshold !== undefined) {
      summary.flexibleMinimumThreshold = flexibleMinimumThreshold.toString();
    }

    await this.dailySummaryRepository.save(summary);
  }

  /**
   * Tổng hợp daily summary cho tất cả active plans vào cuối ngày
   * @param date Ngày cần tổng hợp (format: YYYY-MM-DD)
   */
  async aggregateAllPlansDailySummary(date: string): Promise<void> {
    const activePlans = await this.planRepository.find({
      where: { status: PlanStatus.ACTIVE },
    });

    for (const plan of activePlans) {
      await this.aggregateDailySummary(plan.id, date);
    }
  }
}
