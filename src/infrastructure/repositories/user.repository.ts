import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { User, UserStatus } from '@domain/entities/user.entity';

export interface GetUsersFilter {
  email?: string;
  name?: string;
  role?: string;
  status?: UserStatus;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async getUsersWithFilters(
    filter: GetUsersFilter,
    paging: PagingOptions,
    textSearch?: string,
  ): Promise<[User[], number]> {
    let qb = this.createQueryBuilder('user').where('user.deletedAt IS NULL');

    // Text search
    if (textSearch) {
      qb = qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${textSearch}%` },
      );
    }

    // Filters
    if (filter.email) {
      qb = qb.andWhere('user.email ILIKE :email', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.name) {
      qb = qb.andWhere('user.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.role) {
      qb = qb.andWhere('user.role = :role', { role: filter.role });
    }

    if (filter.status) {
      qb = qb.andWhere('user.status = :status', { status: filter.status });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('user.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
