import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { FilmStatus } from '@domain/entities/film.entity';
import { PaginationDto } from '../pagination.dto';

export class GetFilmsFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: FilmStatus, required: false })
  @IsOptional()
  @IsEnum(FilmStatus)
  status?: FilmStatus;
}

export class GetFilmsQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textSearch?: string;

  @ApiProperty({ type: GetFilmsFilterDto, required: false })
  filter?: GetFilmsFilterDto;
}
