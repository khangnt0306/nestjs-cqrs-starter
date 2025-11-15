import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFilmByIdQuery } from './get-film-by-id.query';
import { FilmRepository } from '@infrastructure/repositories/film.repository';
import { FilmResponseDto } from '@shared/dtos/films';

@QueryHandler(GetFilmByIdQuery)
@Injectable()
export class GetFilmByIdHandler
  implements IQueryHandler<GetFilmByIdQuery, FilmResponseDto>
{
  constructor(private readonly filmRepository: FilmRepository) {}

  async execute(query: GetFilmByIdQuery): Promise<FilmResponseDto> {
    const { filmId } = query;

    const film = await this.filmRepository.findOne({
      where: { id: filmId },
    });

    if (!film) {
      throw new NotFoundException(
        `Film with ID "${filmId}" not found`,
      );
    }

    return new FilmResponseDto(film);
  }
}

