import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { PlanType } from '@domain/entities/plan/plan.enum';

export class CreatePlanDto {
  @ApiProperty({ example: 'Sample Plan' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  currency: string;

  @ApiProperty({ enum: PlanType, example: PlanType.MONTHLY })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  autoRepeat?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  autoAdjustEnabled?: boolean;

  @ApiProperty({ required: false, example: 'Mô tả chi tiết cho kế hoạch' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Tỷ lệ % tối thiểu mỗi ngày so với tổng ngân sách',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  dailyMinLimit?: number;

  @ApiProperty({
    required: false,
    example: 50,
    description: 'Ngưỡng cảnh báo vàng (% so với tổng ngân sách)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  warnLevelYellow?: number;

  @ApiProperty({
    required: false,
    example: 80,
    description: 'Ngưỡng cảnh báo đỏ (% so với tổng ngân sách)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  warnLevelRed?: number;
}
