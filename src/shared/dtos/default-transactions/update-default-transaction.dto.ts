import { PartialType } from '@nestjs/swagger';
import { CreateDefaultTransactionDto } from './create-default-transaction.dto';

export class UpdateDefaultTransactionDto extends PartialType(
  CreateDefaultTransactionDto,
) {}
