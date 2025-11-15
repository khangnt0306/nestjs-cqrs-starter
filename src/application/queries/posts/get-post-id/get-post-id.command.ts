import { ICommand } from '@nestjs/cqrs';

export class GetPostIdCommand implements ICommand {
  constructor(public readonly postId: string) {}
}
