import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DailySummary } from '@domain/entities/daily-summary/daily-summary.entity';

@Injectable()
export class DailySummaryRepository extends BaseRepository<DailySummary> {
  constructor(dataSource: DataSource) {
    super(DailySummary, dataSource);
  }

  async findByPlanAndDate(
    planId: string,
    date: string,
  ): Promise<DailySummary | null> {
    return this.findOne({
      where: { plan: { id: planId }, date },
      relations: ['plan'],
    });
  }

  async findOrCreateByPlanAndDate(
    planId: string,
    date: string,
  ): Promise<DailySummary> {
    let summary = await this.findByPlanAndDate(planId, date);

    if (!summary) {
      summary = this.create({
        plan: { id: planId } as any,
        date,
      });
      summary = await this.save(summary);
    }

    return summary;
  }
}
