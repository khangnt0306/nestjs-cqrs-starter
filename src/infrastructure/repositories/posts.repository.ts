import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { PostEntity } from '@domain/entities/post/post.entity';
import {
  PostStatus,
  PostType,
  PostVisibility,
  PostSource,
} from '@domain/entities/post/post.enum';

export interface GetPostsFilter {
  title?: string;
  content?: string;
  type?: PostType;
  visibility?: PostVisibility;
  source?: PostSource;
  status?: PostStatus;
}

export interface PagingOptions {
  skip: number;
  limit: number;
}

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
  constructor(dataSource: DataSource) {
    super(PostEntity, dataSource);
  }

  async findById(id: string): Promise<PostEntity | null> {
    return this.findOne({ where: { id } });
  }

  async getPostsWithFilters(
    filter: GetPostsFilter,
    paging: PagingOptions,
    textSearch?: string,
  ): Promise<[PostEntity[], number]> {
    let qb = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.deletedAt IS NULL');

    // Text search
    if (textSearch) {
      qb = qb.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${textSearch}%` },
      );
    }

    // Filters
    if (filter.title) {
      qb = qb.andWhere('post.title ILIKE :title', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.content) {
      qb = qb.andWhere('post.content ILIKE :content', {
        content: `%${filter.content}%`,
      });
    }

    if (filter.type) {
      qb = qb.andWhere('post.type = :type', { type: filter.type });
    }

    if (filter.visibility) {
      qb = qb.andWhere('post.visibility = :visibility', {
        visibility: filter.visibility,
      });
    }
    if (filter.source) {
      qb = qb.andWhere('post.source = :source', { source: filter.source });
    }

    // Paging
    qb = qb.skip(paging.skip).take(paging.limit);

    // Sort
    qb = qb.orderBy('post.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
