import { ICommand } from '@nestjs/cqrs';
import { CreatePostDto } from '@shared/dtos/post/commands/create-post.dto';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly dto: CreatePostDto,
    public readonly userId: string,
  ) {}
}
