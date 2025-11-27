import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlanStatusCommand } from './update-plan-status.command';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';
import { PlanResponseDto } from '@shared/dtos/plans';
import { buildHttpExceptionResponse } from '@app/shared/utils/http-exception-response.util';

@CommandHandler(UpdatePlanStatusCommand)
@Injectable()
export class UpdatePlanStatusHandler
  implements ICommandHandler<UpdatePlanStatusCommand, PlanResponseDto>
{
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(command: UpdatePlanStatusCommand): Promise<PlanResponseDto> {
    const { planId, status } = command;

    const plan = await this.planRepository.findOne({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          `Kế hoạch với ID "${planId}" không tồn tại`,
        ]),
      );
    }

    if (plan.status === status) {
      return new PlanResponseDto(plan);
    }

    plan.status = status;
    const updatedPlan = await this.planRepository.save(plan);

    return new PlanResponseDto(updatedPlan);
  }
}
