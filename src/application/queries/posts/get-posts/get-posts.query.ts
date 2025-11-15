import { IQuery } from '@nestjs/cqrs';
import { GetPostsQueryDto } from '@shared/dtos/post/queries/get-post.dto';

export class GetPostsQuery implements IQuery {
  constructor(public readonly queryDto: GetPostsQueryDto) {}
}
