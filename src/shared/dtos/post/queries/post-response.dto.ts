import { ApiProperty } from '@nestjs/swagger';
import {
  PostStatus,
  PostType,
  PostVisibility,
  PostSource,
} from '@domain/entities/post/post.enum';
import { UserResponseDto } from '@shared/dtos/users/queries/user-response.dto';

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  type: PostType;

  @ApiProperty()
  visibility: PostVisibility;

  @ApiProperty()
  source: PostSource;

  @ApiProperty()
  status: PostStatus;

  @ApiProperty({ required: false })
  publishedAt?: Date;

  @ApiProperty({ type: UserResponseDto, required: false })
  user?: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  updatedBy?: string;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
    // Map user relation if exists
    if (partial.user) {
      this.user = new UserResponseDto(partial.user);
    }
  }
}
