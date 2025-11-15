import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { CategoryStatus } from '@domain/entities/category.entity';

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

  @ApiProperty({ enum: CategoryStatus, example: CategoryStatus.ACTIVE })
  @IsEnum(CategoryStatus)
  status: CategoryStatus;
}

