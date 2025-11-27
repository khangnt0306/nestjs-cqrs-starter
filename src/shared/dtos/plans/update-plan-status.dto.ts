import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PlanStatus } from '@domain/entities/plan/plan.enum';

export class UpdatePlanStatusDto {
  @ApiProperty({ enum: PlanStatus })
  @IsEnum(PlanStatus)
  status: PlanStatus;
}
