import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CategoryStatus } from '@domain/entities/category.entity';
import { PaginationDto } from '../pagination.dto';

export class GetCategorysFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: CategoryStatus, required: false })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;
}

export class GetCategorysQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetCategorysFilterDto, required: false })
  filter?: GetCategorysFilterDto;
}

