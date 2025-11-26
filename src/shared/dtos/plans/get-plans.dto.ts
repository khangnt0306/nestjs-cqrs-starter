import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PlanType } from '@domain/entities/plan/plan.enum';
import { PaginationDto } from '../pagination.dto';

export class GetPlansFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: PlanType, required: false })
  @IsOptional()
  @IsEnum(PlanType)
  planType?: PlanType;
}

export class GetPlansQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetPlansFilterDto, required: false })
  filter?: GetPlansFilterDto;
}
