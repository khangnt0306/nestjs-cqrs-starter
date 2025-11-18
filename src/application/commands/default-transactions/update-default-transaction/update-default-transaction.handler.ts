import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDefaultTransactionCommand } from './update-default-transaction.command';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { DefaultTransactionResponseDto } from '@shared/dtos/default-transactions';

@CommandHandler(UpdateDefaultTransactionCommand)
@Injectable()
export class UpdateDefaultTransactionHandler
  implements
    ICommandHandler<
      UpdateDefaultTransactionCommand,
      DefaultTransactionResponseDto
    >
{
  constructor(
    private readonly defaultTransactionRepository: DefaultTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(
    command: UpdateDefaultTransactionCommand,
  ): Promise<DefaultTransactionResponseDto> {
    const { planId, planItemId, id, dto } = command;

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

    // Find default transaction
    const defaultTransaction =
      await this.defaultTransactionRepository.findOneByIdAndPlanItem(
        id,
        planItemId,
      );
    if (!defaultTransaction) {
      throw new NotFoundException(
        `Default transaction with ID "${id}" not found`,
      );
    }

    // Check name duplicate if label is changed
    if (dto.label && dto.label !== defaultTransaction.label) {
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
    }

    // Update fields
    Object.assign(defaultTransaction, dto);

    // Save
    const updated =
      await this.defaultTransactionRepository.save(defaultTransaction);

    // Return response
    return new DefaultTransactionResponseDto({
      id: updated.id,
      planItemId: updated.planItemId,
      label: updated.label,
      amount: updated.amount,
      enabled: updated.enabled,
      createdAt: updated.createdAt,
    });
  }
}
