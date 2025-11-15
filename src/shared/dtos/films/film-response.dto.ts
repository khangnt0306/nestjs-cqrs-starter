import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FilmStatus } from '@domain/entities/film.entity';

@Expose()
export class FilmResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ enum: FilmStatus })
  status: FilmStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<FilmResponseDto>) {
    Object.assign(this, partial);
  }
}
