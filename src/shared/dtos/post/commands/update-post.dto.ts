import {
  PostSource,
  PostStatus,
  PostType,
  PostVisibility,
} from '@app/domain/entities/post/post.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Sample Post' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'Sample Content' })
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  content: string;

  @ApiProperty({ example: PostType.TEXT })
  @IsEnum(PostType)
  type: PostType;

  @ApiProperty({ example: PostVisibility.PUBLIC })
  @IsEnum(PostVisibility)
  visibility: PostVisibility;

  @ApiProperty({ example: PostSource.USER })
  @IsEnum(PostSource)
  source: PostSource;

  @ApiProperty({ example: PostStatus.ACTIVE })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    required: false,
    description: 'Optional: When the post should be published',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
