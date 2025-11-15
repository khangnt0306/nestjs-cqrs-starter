import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { FilmStatus } from '@domain/entities/film.entity';

export class CreateFilmDto {
  @ApiProperty({ example: 'Sample Film' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'Description here', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ enum: FilmStatus, example: FilmStatus.ACTIVE })
  @IsEnum(FilmStatus)
  status: FilmStatus;
}
