import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  CategoryStatus,
  CategoryType,
} from '@domain/entities/categories/categories.enum';

@Expose()
export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: CategoryStatus })
  status: CategoryStatus;

  @ApiProperty({ enum: CategoryType })
  type: CategoryType;

  @ApiProperty({ required: false })
  Icon?: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
