import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DefaultTransactionsController } from './default-transactions.controller';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';

// Command Handlers
import {
  CreateDefaultTransactionHandler,
  UpdateDefaultTransactionHandler,
} from '@application/commands/default-transactions';
import { DeleteDefaultTransactionHandler } from '@application/commands/default-transactions/delete-default-transaction/delete-default-transaction.handler';

// Query Handlers
import {
  GetDefaultTransactionByIdHandler,
  GetDefaultTransactionsHandler,
} from '@application/queries/default-transactions';

const CommandHandlers = [
  CreateDefaultTransactionHandler,
  UpdateDefaultTransactionHandler,
  DeleteDefaultTransactionHandler,
];

const QueryHandlers = [
  GetDefaultTransactionByIdHandler,
  GetDefaultTransactionsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [DefaultTransactionsController],
  providers: [
    DefaultTransactionRepository,
    PlanItemRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [DefaultTransactionRepository],
})
export class DefaultTransactionsModule {}
