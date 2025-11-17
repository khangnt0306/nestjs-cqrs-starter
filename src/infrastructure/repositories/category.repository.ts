import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Category } from '@domain/entities/categories/category.entity';
import {
  CategoryStatus,
  CategoryType,
} from '@domain/entities/categories/categories.enum';

export interface GetCategoriesFilter {
  name?: string;
  status?: CategoryStatus;
  type?: CategoryType;
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

  async getCategoriesWithFilters(
    filter: GetCategoriesFilter,
    paging: PagingOptions,
    textSearch?: string,
    userId?: string,
  ): Promise<[Category[], number]> {
    let qb = this.createQueryBuilder('category').where(
      'category.deletedAt IS NULL',
    );

    // Filter by user ID if provided
    if (userId) {
      qb = qb.andWhere('category.userId = :userId', { userId });
    }

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

    if (filter.type) {
      qb = qb.andWhere('category.type = :type', { type: filter.type });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('category.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
