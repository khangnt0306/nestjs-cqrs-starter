import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class GetDefaultTransactionsFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class GetDefaultTransactionsQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetDefaultTransactionsFilter, required: false })
  filter?: GetDefaultTransactionsFilter;
}
