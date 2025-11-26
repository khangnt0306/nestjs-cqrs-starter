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

  /**
   * Get categories for self (include both self-created and default categories)
   * @param filter Filter options
   * @param paging Paging options
   * @param textSearch Text search
   * @param userId Current user ID
   * @returns Array of categories and total count
   */
  async getSelfCategoriesWithFilters(
    filter: GetCategoriesFilter,
    paging: PagingOptions,
    textSearch?: string,
    userId?: string,
  ): Promise<[Category[], number]> {
    let qb = this.createQueryBuilder('category').where(
      'category.deletedAt IS NULL',
    );

    // Include both:
    // 1. Categories created by user (userId = current user)
    // 2. Default categories (isDefault = true)
    if (userId) {
      qb = qb.andWhere(
        '(category.userId = :userId OR category.isDefault = true)',
        { userId },
      );
    } else {
      // If no userId, only get default categories
      qb = qb.andWhere('category.isDefault = true');
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

    // Sort: default categories first, then by createdAt
    qb = qb
      .orderBy('category.isDefault', 'DESC')
      .addOrderBy('category.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
