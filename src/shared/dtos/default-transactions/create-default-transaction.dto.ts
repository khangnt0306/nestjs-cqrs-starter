import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDefaultTransactionDto {
  @ApiProperty({ example: 'Ăn sáng' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  label: string;

  @ApiProperty({ example: '50.00' })
  @IsString()
  @Transform(({ value }) => String(value))
  amount: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
