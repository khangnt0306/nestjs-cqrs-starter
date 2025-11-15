import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  UseGuards,
  Param,
  Delete,
  Post,
  Request,
  Put,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetPostsQuery } from '@application/queries/posts/get-posts/get-posts.query';
import { GetPostsResponseDto } from '@application/queries/posts/get-posts/get-posts.handler';
import { GetPostsQueryDto } from '@shared/dtos/post/queries/get-post.dto';
import { PostResponseDto } from '@shared/dtos/post/queries/post-response.dto';
import { CreatePostCommand } from '@application/commands/posts/create-post/create-post.command';
import { CreatePostDto } from '@shared/dtos/post/commands/create-post.dto';
import { DeletePostCommand } from '@application/commands/posts/delete-post/delete-post.command';
import { DeletePostResponseDto } from '@shared/dtos/post/commands/delete-post-response.dto';
import { GetPostIdCommand } from '@application/queries/posts/get-post-id/get-post-id.command';
import { OwnershipGuard } from '../auth/guards/ownership.guard';
import { CheckOwnership } from '../auth/decorators/check-ownership.decorator';
import { UpdatePostCommand } from '@application/commands/posts/update-post/update-post.command';
import { PostEntity } from '@domain/entities/post/post.entity';
import { UpdatePostDto } from '@shared/dtos/post/commands/update-post.dto';

@ApiTags('posts') // Swagger tags
@Controller('posts') // Controller path
@UseInterceptors(ClassSerializerInterceptor) // Interceptor to transform the response class
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with filters' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
  })
  async findAll(@Query() queryDto: GetPostsQueryDto) {
    return this.queryBus.execute<GetPostsQuery, GetPostsResponseDto>(
      new GetPostsQuery(queryDto),
    );
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.commandBus.execute<CreatePostCommand, PostResponseDto>(
      new CreatePostCommand(createPostDto, req.user.id),
    );
  }
  @Get(':postId')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResponseDto,
  })
  async getById(@Param('postId') postId: string) {
    return this.queryBus.execute<GetPostIdCommand, PostResponseDto>(
      new GetPostIdCommand(postId),
    );
  }
  @Delete(':postId')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership({
    entity: PostEntity,
    ownerField: 'user',
    param: 'postId',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  async delete(@Param('postId') postId: string) {
    return this.commandBus.execute<DeletePostCommand, DeletePostResponseDto>(
      new DeletePostCommand(postId),
    );
  }
  @Put(':postId')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @CheckOwnership({
    entity: PostEntity,
    ownerField: 'user',
    param: 'postId',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    return this.commandBus.execute<UpdatePostCommand, PostResponseDto>(
      new UpdatePostCommand(postId, updatePostDto, req.user.id),
    );
  }
}
