import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { RepeatType } from '@domain/entities/plan/plan.enum';
import { PaginationDto } from '../pagination.dto';

export class GetPlansFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: RepeatType, required: false })
  @IsOptional()
  @IsEnum(RepeatType)
  repeatType?: RepeatType;
}

export class GetPlansQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetPlansFilterDto, required: false })
  filter?: GetPlansFilterDto;
}
