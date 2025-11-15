import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  PostSource,
  PostStatus,
  PostType,
  PostVisibility,
} from '@domain/entities/post/post.enum';
import { PaginationDto } from '../../pagination.dto';

export class GetPostsFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PostSource)
  source?: PostSource;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}

export class GetPostsQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetPostsFilterDto, required: false })
  filter?: GetPostsFilterDto;
}
