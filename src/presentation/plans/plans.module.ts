import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlansController } from './plans.controller';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { UserRepository } from '@infrastructure/repositories';
import { PlanCalculationService } from '@shared/services/plan-calculation.service';
import { DailyTransactionRepository } from '@infrastructure/repositories/daily-transaction.repository';

// Command Handlers
import {
  CreatePlanHandler,
  UpdatePlanHandler,
  DeletePlanHandler,
} from '@application/commands/plans';

// Query Handlers
import {
  GetPlanByIdHandler,
  GetPlansHandler,
} from '@application/queries/plans';
import { GetPlansSelfHandler } from '@application/queries/plans/get-plans-self/get-plans.handler';

const CommandHandlers = [
  CreatePlanHandler,
  UpdatePlanHandler,
  DeletePlanHandler,
];

const QueryHandlers = [
  GetPlanByIdHandler,
  GetPlansHandler,
  GetPlansSelfHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [PlansController],
  providers: [
    PlanRepository,
    UserRepository,
    PlanCalculationService,
    DailyTransactionRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PlanRepository],
})
export class PlansModule {}
