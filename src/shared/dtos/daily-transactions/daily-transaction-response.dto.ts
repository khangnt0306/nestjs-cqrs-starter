import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class DailyTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ required: false })
  planItemId?: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<DailyTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class DailyTransactionsByDateDto {
  @ApiProperty()
  date: string;

  @ApiProperty({ type: () => [DailyTransactionResponseDto] })
  transactions: DailyTransactionResponseDto[];

  constructor(partial: Partial<DailyTransactionsByDateDto>) {
    Object.assign(this, partial);
  }
}
