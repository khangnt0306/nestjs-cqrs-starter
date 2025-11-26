import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, MinLength, MaxLength } from 'class-validator';

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
}
