import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import {
  EXCLUDE_TYPE,
  PlanItemType,
} from '@domain/entities/planItem/planItem.enum';

export class CreatePlanItemDto {
  @ApiProperty({ example: 'Sample Plan Item' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'Description here', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ enum: PlanItemType, example: PlanItemType.INCOME })
  @IsEnum(PlanItemType)
  type: PlanItemType;

  @ApiProperty({ enum: EXCLUDE_TYPE, example: EXCLUDE_TYPE.FIXED })
  @IsEnum(EXCLUDE_TYPE)
  excludeType: EXCLUDE_TYPE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
