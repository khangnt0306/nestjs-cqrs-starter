import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { RepeatType } from '@domain/entities/plan/plan.enum';

export class CreatePlanDto {
  @ApiProperty({ example: 'Sample Plan' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    enum: RepeatType,
    required: false,
    default: RepeatType.NONE,
  })
  @IsOptional()
  @IsEnum(RepeatType)
  repeatType?: RepeatType;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  autoAdjustEnabled?: boolean;

  @ApiProperty({ required: false, example: 100.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyMinLimit?: number;

  @ApiProperty({ required: false, example: 500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  warnLevelYellow?: number;

  @ApiProperty({ required: false, example: 1000.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  warnLevelRed?: number;
}
