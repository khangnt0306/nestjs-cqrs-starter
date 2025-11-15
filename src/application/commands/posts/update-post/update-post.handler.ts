import { PostResponseDto } from '@shared/dtos/post/queries/post-response.dto';
import { UpdatePostCommand } from './update-post.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@infrastructure/repositories/posts.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(UpdatePostCommand)
@Injectable()
export class UpdatePostHandler
  implements ICommandHandler<UpdatePostCommand, PostResponseDto>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand): Promise<PostResponseDto> {
    const { postId, updatePostDto, userId } = command;

    // Find post
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check ownership
    if (post.user.id !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    // Update post
    Object.assign(post, updatePostDto);

    // Save to database
    const updatedPost = await this.postRepository.save(post);

    // Load post with user relation for response
    const postWithUser = await this.postRepository.findOne({
      where: { id: updatedPost.id },
      relations: ['user'],
    });

    // Return response
    return new PostResponseDto(postWithUser);
  }
}
