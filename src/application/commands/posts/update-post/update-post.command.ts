import { ICommand } from '@nestjs/cqrs';
import { UpdatePostDto } from '@shared/dtos/post/commands/update-post.dto';

export class UpdatePostCommand implements ICommand {
  constructor(
    public readonly postId: string,
    public readonly updatePostDto: UpdatePostDto,
    public readonly userId: string,
  ) {}
}
