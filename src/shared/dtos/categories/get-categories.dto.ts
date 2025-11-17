import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import {
  CategoryStatus,
  CategoryType,
} from '@domain/entities/categories/categories.enum';
import { PaginationDto } from '../pagination.dto';

export class GetCategoriesFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: CategoryStatus, required: false })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @ApiProperty({ enum: CategoryType, required: false })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}

export class GetCategoriesQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetCategoriesFilterDto, required: false })
  filter?: GetCategoriesFilterDto;
}
