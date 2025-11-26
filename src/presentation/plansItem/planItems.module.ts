import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlanItemsController } from './planItems.controller';
import { UserRepository } from '@infrastructure/repositories';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';

// Command Handlers
import {
  CreatePlanItemHandler,
  UpdatePlanItemHandler,
} from '@application/commands/planItems';
import { DeletePlanItemHandler } from '@application/commands/planItems/delete-plan-item/delete-plan-item.handler';

// Query Handlers
import {
  GetPlanItemByIdHandler,
  GetPlanItemHandler,
} from '@application/queries/plans-item';
import { GetPlanItemsSelfHandler } from '@application/queries/plans-item/get-plan-item-self/get-plan-item.handler';

const CommandHandlers = [
  CreatePlanItemHandler,
  UpdatePlanItemHandler,
  DeletePlanItemHandler,
];

const QueryHandlers = [
  GetPlanItemByIdHandler,
  GetPlanItemHandler,
  GetPlanItemsSelfHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [PlanItemsController],
  providers: [
    PlanItemRepository,
    PlanRepository,
    UserRepository,
    PlanCalculationService,
    DailyTransactionRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PlanItemRepository, PlanRepository],
})
export class PlanItemsModule {}
