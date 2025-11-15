import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '@infrastructure/repositories/posts.repository';
import { PostResponseDto } from '@shared/dtos/post/queries/post-response.dto';
import { UserRepository } from '@infrastructure/repositories';

@CommandHandler(CreatePostCommand)
@Injectable()
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, PostResponseDto>
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostResponseDto> {
    const { dto, userId } = command;

    // Get user entity
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create post with user relation
    const post = this.postRepository.create({
      ...dto,
      user: {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        user_name: user.user_name,
        phone_number: user.phone_number,
        date_of_birth: user.date_of_birth,
        avatar_url: user.avatar_url,
      },
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });

    // Save to database
    const savedPost = await this.postRepository.save(post);

    // Load post with user relation for response
    const postWithUser = await this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['user'],
    });

    // Return response
    return new PostResponseDto(postWithUser);
  }
}
