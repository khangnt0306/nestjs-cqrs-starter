import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFilmsQuery } from './get-films.query';
import { FilmRepository } from '@infrastructure/repositories/film.repository';
import { FilmResponseDto } from '@shared/dtos/films';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';

export class GetFilmsResponseDto {
  films: FilmResponseDto[];
  pagination: PaginationResponseDto;

  constructor(films: FilmResponseDto[], pagination: PaginationResponseDto) {
    this.films = films;
    this.pagination = pagination;
  }
}

@QueryHandler(GetFilmsQuery)
@Injectable()
export class GetFilmsHandler
  implements IQueryHandler<GetFilmsQuery, GetFilmsResponseDto>
{
  constructor(private readonly filmRepository: FilmRepository) {}

  async execute(query: GetFilmsQuery): Promise<GetFilmsResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [films, total] = await this.filmRepository.getFilmsWithFilters(
      filter,
      { skip, limit },
      textSearch,
    );

    const filmDtos = films.map((film) => new FilmResponseDto(film));
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetFilmsResponseDto(filmDtos, pagination);
  }
}

