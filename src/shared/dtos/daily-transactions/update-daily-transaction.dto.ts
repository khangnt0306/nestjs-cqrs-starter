import { PartialType } from '@nestjs/swagger';
import { CreateDailyTransactionDto } from './create-daily-transaction.dto';

export class UpdateDailyTransactionDto extends PartialType(
  CreateDailyTransactionDto,
) {}
