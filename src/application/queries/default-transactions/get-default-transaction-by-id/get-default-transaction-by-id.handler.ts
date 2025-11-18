import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DefaultTransactionRepository } from '@infrastructure/repositories/default-transaction.repository';
import { PlanItemRepository } from '@infrastructure/repositories/planItem.repository';
import { DefaultTransactionResponseDto } from '@shared/dtos/default-transactions';
import { GetDefaultTransactionByIdQuery } from './get-default-transaction-by-id.query';

@QueryHandler(GetDefaultTransactionByIdQuery)
@Injectable()
export class GetDefaultTransactionByIdHandler
  implements
    IQueryHandler<GetDefaultTransactionByIdQuery, DefaultTransactionResponseDto>
{
  constructor(
    private readonly defaultTransactionRepository: DefaultTransactionRepository,
    private readonly planItemRepository: PlanItemRepository,
  ) {}

  async execute(
    query: GetDefaultTransactionByIdQuery,
  ): Promise<DefaultTransactionResponseDto> {
    const { planId, planItemId, id } = query;

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

    return new DefaultTransactionResponseDto({
      id: defaultTransaction.id,
      planItemId: defaultTransaction.planItemId,
      label: defaultTransaction.label,
      amount: defaultTransaction.amount,
      enabled: defaultTransaction.enabled,
      createdAt: defaultTransaction.createdAt,
    });
  }
}
