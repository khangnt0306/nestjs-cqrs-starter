import { ApiProperty } from '@nestjs/swagger';

export class DeletePostResponseDto {
  @ApiProperty({
    example: 'Post deleted successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the deleted post',
  })
  postId: string;

  constructor(message: string, postId: string) {
    this.message = message;
    this.postId = postId;
  }
}
