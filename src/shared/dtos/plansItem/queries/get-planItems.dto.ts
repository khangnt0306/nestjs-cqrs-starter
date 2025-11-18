import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../pagination.dto';
import { PlanItemType } from '@domain/entities/planItem/planItem.enum';

export class GetPlanItemsFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: PlanItemType, required: false })
  @IsOptional()
  @IsEnum(PlanItemType)
  type?: PlanItemType;
}

export class GetPlanItemsQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetPlanItemsFilter, required: false })
  filter?: GetPlanItemsFilter;
}
