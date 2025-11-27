import { Injectable } from '@nestjs/common';
import { PlanType } from '@domain/entities/plan/plan.enum';
import { PlanItem } from '@app/domain/entities/planItem/planItem.entity';
import { PlanItemType } from '@app/domain/entities/planItem/planItem.enum';

@Injectable()
export class PlanCalculationService {
  /**
   * Tính số tiền trung bình hàng ngày dựa trên planType và tổng amount
   * @param amount Tổng số tiền của planItem
   * @param planType Loại kế hoạch (DAILY, WEEKLY, MONTHLY, YEARLY)
   * @param date Ngày cụ thể để tính số ngày trong tháng/năm (optional)
   * @returns Số tiền trung bình hàng ngày
   */
  calculateDailyAverage(
    amount: number,
    planType: PlanType,
    date?: Date | string,
  ): number {
    const referenceDate = date ? new Date(date) : new Date();
    const remainingDays = this.getRemainingDaysForPlanType(
      planType,
      referenceDate,
    );

    if (remainingDays <= 0) {
      return amount;
    }

    return amount / remainingDays;
  }

  /**
   * Tính số tiền tối thiểu hàng ngày dựa trên minimumPercentage
   * @param dailyAverage Số tiền trung bình hàng ngày
   * @param minimumPercentage Tỷ lệ % tối thiểu (0-100)
   * @returns Số tiền tối thiểu hàng ngày
   */
  calculateDailyMinimum(
    dailyAverage: number,
    minimumPercentage: number,
  ): number {
    return (dailyAverage * minimumPercentage) / 100;
  }

  /**
   * Kiểm tra xem số tiền có dưới ngưỡng tối thiểu không
   * @param actualAmount Số tiền thực tế
   * @param dailyMinimum Số tiền tối thiểu hàng ngày
   * @returns true nếu dưới ngưỡng tối thiểu
   */
  isBelowMinimum(actualAmount: number, dailyMinimum: number): boolean {
    return actualAmount < dailyMinimum;
  }

  /**
   * Tính toán lại số tiền trung bình khi có transaction vượt quá
   * Logic: Nếu transaction vượt quá trung bình ban đầu, tính lại trung bình
   * bằng cách chia lại tổng còn lại cho số ngày còn lại
   * @param originalAmount Tổng số tiền ban đầu
   * @param planType Loại kế hoạch
   * @param date Ngày hiện tại
   * @param exceededAmount Số tiền đã vượt quá
   * @param daysPassed Số ngày đã trôi qua
   * @returns Số tiền trung bình mới
   */
  recalculateAverageAfterExceed(
    originalAmount: number,
    planType: PlanType,
    date: Date | string,
    exceededAmount: number,
    daysPassed: number,
  ): number {
    const referenceDate = date ? new Date(date) : new Date();
    const totalDays = this.getTotalDaysForPlanType(planType, referenceDate);
    const remainingDays = totalDays - daysPassed;

    if (remainingDays <= 0) {
      return exceededAmount;
    }

    // Số tiền còn lại sau khi trừ đi phần đã vượt quá
    const remainingAmount = originalAmount - exceededAmount;
    // Trung bình mới = số tiền còn lại / số ngày còn lại
    return remainingAmount / remainingDays;
  }

  private getDaysInMonth(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private getDayOfYear(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const timezoneOffsetDiff =
      (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const diff = date.getTime() - startOfYear.getTime() + timezoneOffsetDiff;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getRemainingDaysForPlanType(planType: PlanType, date: Date): number {
    switch (planType) {
      case PlanType.DAILY:
        return 1;
      case PlanType.WEEKLY:
        return this.getRemainingDaysInWeek(date);
      case PlanType.MONTHLY:
        return this.getRemainingDaysInMonth(date);
      case PlanType.YEARLY:
        return this.getRemainingDaysInYear(date);
      default:
        return 1;
    }
  }

  private getRemainingDaysInWeek(date: Date): number {
    const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
    const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    const remaining = 7 - normalizedDay + 1;
    return Math.max(1, remaining);
  }

  private getRemainingDaysInMonth(date: Date): number {
    const daysInMonth = this.getDaysInMonth(date);
    const dayOfMonth = date.getDate();
    const remaining = daysInMonth - dayOfMonth + 1;
    return Math.max(1, remaining);
  }

  private getRemainingDaysInYear(date: Date): number {
    const totalDays = this.isLeapYear(date.getFullYear()) ? 366 : 365;
    const dayOfYear = this.getDayOfYear(date);
    const remaining = totalDays - dayOfYear + 1;
    return Math.max(1, remaining);
  }

  private getTotalDaysForPlanType(planType: PlanType, date: Date): number {
    switch (planType) {
      case PlanType.DAILY:
        return 1;
      case PlanType.WEEKLY:
        return 7;
      case PlanType.MONTHLY:
        return this.getDaysInMonth(date);
      case PlanType.YEARLY:
        return this.isLeapYear(date.getFullYear()) ? 366 : 365;
      default:
        return 30;
    }
  }
  totalIncomeForPlanType(planItems: PlanItem[]): number {
    return planItems.reduce((acc, item) => {
      if (item.type === PlanItemType.INCOME) {
        return acc + Number(item.amount);
      }
      return acc;
    }, 0);
  }

  totalExpenseForPlanType(planItems: PlanItem[]): number {
    return planItems.reduce((acc, item) => {
      if (item.type === PlanItemType.EXPENSE) {
        return acc + Number(item.amount);
      }
      return acc;
    }, 0);
  }
}
