import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Category, CategoryStatus } from '@domain/entities/category.entity';

export interface GetCategorysFilter {
  name?: string;
  status?: CategoryStatus;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(dataSource: DataSource) {
    super(Category, dataSource);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.findOne({ where: { name } });
  }

  async getCategorysWithFilters(
    filter: GetCategorysFilter,
    paging: PagingOptions,
    textSearch?: string,
  ): Promise<[Category[], number]> {
    let qb = this.createQueryBuilder('category').where('category.deletedAt IS NULL');

    // Text search
    if (textSearch) {
      qb = qb.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${textSearch}%` },
      );
    }

    // Filters
    if (filter.name) {
      qb = qb.andWhere('category.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.status) {
      qb = qb.andWhere('category.status = :status', { status: filter.status });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('category.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}

