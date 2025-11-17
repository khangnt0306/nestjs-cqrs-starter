import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  CategoryStatus,
  CategoryType,
} from '@domain/entities/categories/categories.enum';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sample Category' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'Description here', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    enum: CategoryStatus,
    required: false,
    default: CategoryStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @ApiProperty({
    enum: CategoryType,
    required: false,
    default: CategoryType.INCOME,
  })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @ApiProperty({ required: false, example: 'icon-name' })
  @IsOptional()
  @IsString()
  Icon?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
