import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command';
import { PostRepository } from '@infrastructure/repositories/posts.repository';
import { DeletePostResponseDto } from '@app/shared/dtos/post/commands/delete-post-response.dto';

@CommandHandler(DeletePostCommand)
@Injectable()
export class DeletePostHandler
  implements ICommandHandler<DeletePostCommand, DeletePostResponseDto>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: DeletePostCommand): Promise<DeletePostResponseDto> {
    const { postId } = command;

    // Find post
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Delete
    await this.postRepository.delete(postId);

    return new DeletePostResponseDto('Post deleted successfully', postId);
  }
}
