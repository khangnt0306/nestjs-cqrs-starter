import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlanItemCommand } from './create-plan-item.command';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { PlanItemResponseDto } from '@shared/dtos/plansItem';
import { PlanRepository } from '@infrastructure/repositories/plan.repository';

@CommandHandler(CreatePlanItemCommand)
@Injectable()
export class CreatePlanItemHandler
  implements ICommandHandler<CreatePlanItemCommand, PlanItemResponseDto>
{
  constructor(
    private readonly planItemRepository: PlanItemRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(command: CreatePlanItemCommand): Promise<PlanItemResponseDto> {
    const { dto, planId } = command;

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID "${planId}" not found`);
    }

    const existingPlanItem = await this.planItemRepository.findByName(
      dto.name,
      planId,
    );
    if (existingPlanItem) {
      throw new ConflictException(
        `Plan item with name "${dto.name}" already exists in this plan`,
      );
    }

    const planItem = this.planItemRepository.create({
      planId,
      name: dto.name,
      amount: dto.amount,
      description: dto.description,
      excludeType: dto.excludeType,
      type: dto.type,
      categoryId: dto.categoryId,
    });

    const savedPlanItem = await this.planItemRepository.save(planItem);

    return new PlanItemResponseDto(savedPlanItem);
  }
}
