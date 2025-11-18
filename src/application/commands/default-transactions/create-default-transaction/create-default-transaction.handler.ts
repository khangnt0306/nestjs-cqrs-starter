import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDefaultTransactionCommand } from './create-default-transaction.command';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { DefaultTransactionResponseDto } from '@shared/dtos/default-transactions';

@CommandHandler(CreateDefaultTransactionCommand)
@Injectable()
export class CreateDefaultTransactionHandler
  implements
    ICommandHandler<
      CreateDefaultTransactionCommand,
      DefaultTransactionResponseDto
    >
{
  constructor(
    private readonly defaultTransactionRepository: DefaultTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(
    command: CreateDefaultTransactionCommand,
  ): Promise<DefaultTransactionResponseDto> {
    const { planId, planItemId, dto } = command;

    // Verify plan item exists and belongs to plan
    const planItem = await this.planItemRepository.findOneByIdAndPlan(
      planItemId,
      planId,
    );
    if (!planItem) {
      throw new NotFoundException(
        `Plan item with ID "${planItemId}" not found in plan "${planId}"`,
      );
    }

    // Check for duplicate label
    const existing =
      await this.defaultTransactionRepository.findByLabelAndPlanItem(
        dto.label,
        planItemId,
      );
    if (existing) {
      throw new ConflictException(
        `Default transaction with label "${dto.label}" already exists for this plan item`,
      );
    }

    // Create entity
    const defaultTransaction = this.defaultTransactionRepository.create({
      label: dto.label,
      amount: dto.amount,
      enabled: dto.enabled ?? true,
      planItemId: planItem.id,
      planItem: planItem,
    });

    // Save to database
    const saved =
      await this.defaultTransactionRepository.save(defaultTransaction);

    // Return response
    return new DefaultTransactionResponseDto({
      id: saved.id,
      planItemId: saved.planItemId,
      label: saved.label,
      amount: saved.amount,
      enabled: saved.enabled,
      createdAt: saved.createdAt,
    });
  }
}
