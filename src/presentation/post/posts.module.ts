import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostRepository } from '@infrastructure/repositories/posts.repository';
import { UserRepository } from '@infrastructure/repositories';
import { CreatePostHandler } from '@application/commands/posts/create-post/create-post.handler';
import { GetPostsHandler } from '@application/queries/posts/get-posts/get-posts.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetPostIdHandler } from '@application/queries/posts/get-post-id/get-post-id-handler';
import { DeletePostHandler } from '@application/commands/posts/delete-post/delete-post.handler';
import { UpdatePostHandler } from '@application/commands/posts/update-post/update-post.handler';

const commandHandlers = [
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
];
const queryHandlers = [GetPostsHandler, GetPostIdHandler];

@Module({
  imports: [CqrsModule],
  controllers: [PostsController],
  providers: [
    PostRepository,
    UserRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: [PostRepository],
})
export class PostsModule {}
