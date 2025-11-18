import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DailyTransactionsController } from './daily-transactions.controller';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';

// Command Handlers
import {
  CreateDailyTransactionHandler,
  UpdateDailyTransactionHandler,
} from '@application/commands/daily-transactions';
import { DeleteDailyTransactionHandler } from '@application/commands/daily-transactions/delete-daily-transaction/delete-daily-transaction.handler';

// Query Handlers
import {
  GetDailyTransactionByIdHandler,
  GetDailyTransactionsHandler,
} from '@application/queries/daily-transactions';

const CommandHandlers = [
  CreateDailyTransactionHandler,
  UpdateDailyTransactionHandler,
  DeleteDailyTransactionHandler,
];

const QueryHandlers = [
  GetDailyTransactionByIdHandler,
  GetDailyTransactionsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [DailyTransactionsController],
  providers: [
    DailyTransactionRepository,
    PlanItemRepository,
    PlanRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [DailyTransactionRepository],
})
export class DailyTransactionsModule {}

