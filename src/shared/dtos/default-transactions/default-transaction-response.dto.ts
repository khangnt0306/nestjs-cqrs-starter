import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class DefaultTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planItemId: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<DefaultTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
