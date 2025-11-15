import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostsQuery } from './get-posts.query';
import { PostRepository } from '@infrastructure/repositories/posts.repository';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';
import { PostResponseDto } from '@shared/dtos/post/queries/post-response.dto';

export class GetPostsResponseDto {
  posts: PostResponseDto[];
  pagination: PaginationResponseDto;

  constructor(posts: PostResponseDto[], pagination: PaginationResponseDto) {
    this.posts = posts;
    this.pagination = pagination;
  }
}

@QueryHandler(GetPostsQuery)
@Injectable()
export class GetPostsHandler
  implements IQueryHandler<GetPostsQuery, GetPostsResponseDto>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostsQuery): Promise<GetPostsResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [posts, total] = await this.postRepository.getPostsWithFilters(
      filter,
      { skip, limit },
      textSearch,
    );

    const postDtos = posts.map((post) => new PostResponseDto(post));
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetPostsResponseDto(postDtos, pagination);
  }
}
