import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Film, FilmStatus } from '@domain/entities/film.entity';

export interface GetFilmsFilter {
  name?: string;
  status?: FilmStatus;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class FilmRepository extends BaseRepository<Film> {
  constructor(dataSource: DataSource) {
    super(Film, dataSource);
  }

  async findByName(name: string): Promise<Film | null> {
    return this.findOne({ where: { name } });
  }

  async getFilmsWithFilters(
    filter: GetFilmsFilter,
    paging: PagingOptions,
    textSearch?: string,
  ): Promise<[Film[], number]> {
    let qb = this.createQueryBuilder('film').where('film.deletedAt IS NULL');

    // Text search
    if (textSearch) {
      qb = qb.andWhere(
        '(film.name ILIKE :search OR film.description ILIKE :search)',
        { search: `%${textSearch}%` },
      );
    }

    // Filters
    if (filter.name) {
      qb = qb.andWhere('film.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.status) {
      qb = qb.andWhere('film.status = :status', { status: filter.status });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('film.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
