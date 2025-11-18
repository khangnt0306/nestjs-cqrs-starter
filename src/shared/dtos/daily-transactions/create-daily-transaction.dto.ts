import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TransactionType } from '@domain/entities/daily-transaction/daily-transaction.entity';

export class CreateDailyTransactionDto {
  @ApiProperty({ example: 'Ăn sáng' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  label: string;

  @ApiProperty({ example: '50.00' })
  @IsString()
  amount: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date in YYYY-MM-DD format',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefaultGenerated?: boolean;
}
