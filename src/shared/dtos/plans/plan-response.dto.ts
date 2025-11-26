import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PlanType, PlanStatus } from '@domain/entities/plan/plan.enum';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';

@Expose()
export class PlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: PlanType })
  planType: PlanType;

  @ApiProperty()
  autoRepeat: boolean;

  @ApiProperty()
  autoAdjustEnabled: boolean;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ example: 'VND' })
  currency: string;

  @ApiProperty({ example: 1000000 })
  totalBudget: number;

  @ApiProperty({ enum: PlanStatus })
  status: PlanStatus;

  @ApiProperty({
    required: false,
    description: 'Phần trăm tối thiểu mỗi ngày so với tổng ngân sách',
  })
  dailyMinLimit?: number;

  @ApiProperty({
    required: false,
    description: 'Phần trăm cảnh báo vàng so với tổng ngân sách',
  })
  warnLevelYellow?: number;

  @ApiProperty({
    required: false,
    description: 'Phần trăm cảnh báo đỏ so với tổng ngân sách',
  })
  warnLevelRed?: number;

  @ApiProperty({
    required: false,
    description: 'Giá trị tối thiểu mỗi ngày (đơn vị tiền tệ)',
  })
  dailyMinLimitValue?: number;

  @ApiProperty({
    required: false,
    description: 'Giá trị cảnh báo vàng (đơn vị tiền tệ)',
  })
  warnLevelYellowValue?: number;

  @ApiProperty({
    required: false,
    description: 'Giá trị cảnh báo đỏ (đơn vị tiền tệ)',
  })
  warnLevelRedValue?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: PlanItemResponseDto, isArray: true, required: false })
  items?: PlanItemResponseDto[];

  constructor(partial: Partial<PlanResponseDto>) {
    Object.assign(this, partial);

    if (this.totalBudget !== undefined && this.totalBudget !== null) {
      this.totalBudget = Number(this.totalBudget);
    }

    this.dailyMinLimit = this.normalizePercent(this.dailyMinLimit);
    this.warnLevelYellow = this.normalizePercent(this.warnLevelYellow);
    this.warnLevelRed = this.normalizePercent(this.warnLevelRed);

    this.dailyMinLimitValue = this.calculateThresholdValue(this.dailyMinLimit);
    this.warnLevelYellowValue = this.calculateThresholdValue(
      this.warnLevelYellow,
    );
    this.warnLevelRedValue = this.calculateThresholdValue(this.warnLevelRed);
  }

  private calculateThresholdValue(percent?: number): number | undefined {
    if (
      percent === undefined ||
      percent === null ||
      this.totalBudget === undefined ||
      this.totalBudget === null
    ) {
      return undefined;
    }

    return Number(
      ((Number(this.totalBudget) * Number(percent)) / 100).toFixed(2),
    );
  }

  private normalizePercent(value?: number | string): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return Number(value);
  }
}
