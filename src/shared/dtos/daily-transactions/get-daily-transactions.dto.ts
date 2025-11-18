import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { PaginationDto } from '../pagination.dto';
import { TransactionType } from '@domain/entities/daily-transaction/daily-transaction.entity';

export class GetDailyTransactionsFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ required: false, description: 'Date in YYYY-MM-DD format' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDefaultGenerated?: boolean;
}

export class GetDailyTransactionsQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetDailyTransactionsFilter, required: false })
  filter?: GetDailyTransactionsFilter;
}
