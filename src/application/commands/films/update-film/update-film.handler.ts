import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFilmCommand } from './update-film.command';
import { FilmRepository } from '@infrastructure/repositories/film.repository';
import { FilmResponseDto } from '@shared/dtos/films';

@CommandHandler(UpdateFilmCommand)
@Injectable()
export class UpdateFilmHandler
  implements ICommandHandler<UpdateFilmCommand, FilmResponseDto>
{
  constructor(private readonly filmRepository: FilmRepository) {}

  async execute(command: UpdateFilmCommand): Promise<FilmResponseDto> {
    const { filmId, dto } = command;

    // Find film
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
    });
    if (!film) {
      throw new NotFoundException(`Film with ID "${filmId}" not found`);
    }

    // Check name duplicate if name is changed
    if (dto.name && dto.name !== film.name) {
      const existingFilm = await this.filmRepository.findByName(dto.name);
      if (existingFilm) {
        throw new ConflictException(
          `Film with name "${dto.name}" already exists`,
        );
      }
    }

    // Update fields
    Object.assign(film, dto);

    // Save
    const updatedFilm = await this.filmRepository.save(film);

    // Return response
    return new FilmResponseDto(updatedFilm);
  }
}
