import { PostRepository } from '@infrastructure/repositories/posts.repository';
import { GetPostIdCommand } from './get-post-id.command';
import { PostResponseDto } from '@shared/dtos/post/queries/post-response.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';

@QueryHandler(GetPostIdCommand)
@Injectable()
export class GetPostIdHandler
  implements IQueryHandler<GetPostIdCommand, PostResponseDto>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostIdCommand): Promise<PostResponseDto> {
    const { postId } = query;
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return new PostResponseDto(post);
  }
}
