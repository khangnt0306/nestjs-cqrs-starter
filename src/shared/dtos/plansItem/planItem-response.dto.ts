import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { DistributeType } from '@domain/entities/planItem/planItem.enum';

@Expose()
export class PlanItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ required: false })
  categoryId?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  minimumPercentage?: number;

  @ApiProperty({
    required: false,
    description:
      'Tổng số tiền đã sử dụng (chỉ áp dụng cho chi tiêu loại linh hoạt)',
  })
  spentAmount?: number;
  @ApiProperty({
    required: false,
    description: 'Số tiền tiết kiệm (budget còn lại) cho chi tiêu linh hoạt',
  })
  savedAmount?: number;
  @ApiProperty({
    required: false,
    description:
      'Số tiền trung bình hàng ngày (chỉ áp dụng cho chi tiêu loại linh hoạt)',
  })
  averageDaily?: number;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  @IsObject()
  flexibleOptions?: {
    distributeType?: DistributeType;
    minDailyLimit?: number;
    maxDailyLimit?: number;
    adjustable?: boolean;
    useDailyDefault?: boolean;
    dailyDefaultTransactions?: {
      description: string;
      amount: number;
      categoryId?: string;
    }[];
  };
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<PlanItemResponseDto>) {
    Object.assign(this, partial);
  }
}
