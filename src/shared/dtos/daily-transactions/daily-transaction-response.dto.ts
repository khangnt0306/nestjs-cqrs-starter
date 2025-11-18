import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransactionType } from '@domain/entities/daily-transaction/daily-transaction.entity';

@Expose()
export class DailyTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ required: false })
  planItemId?: string;

  @ApiProperty({ required: false })
  categoryId?: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  date: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  isDefaultGenerated: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<DailyTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
