import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RepeatType } from '@domain/entities/plan/plan.enum';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';

@Expose()
export class PlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty({ enum: RepeatType })
  repeatType: RepeatType;

  @ApiProperty()
  autoAdjustEnabled: boolean;

  @ApiProperty({ required: false })
  dailyMinLimit?: number;

  @ApiProperty({ required: false })
  warnLevelYellow?: number;

  @ApiProperty({ required: false })
  warnLevelRed?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: PlanItemResponseDto, isArray: true, required: false })
  items?: PlanItemResponseDto[];

  constructor(partial: Partial<PlanResponseDto>) {
    Object.assign(this, partial);
  }
}
