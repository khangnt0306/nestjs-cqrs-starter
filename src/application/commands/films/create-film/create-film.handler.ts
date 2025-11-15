import { Injectable, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFilmCommand } from './create-film.command';
import { FilmRepository } from '@infrastructure/repositories/film.repository';
import { FilmResponseDto } from '@shared/dtos/films';

@CommandHandler(CreateFilmCommand)
@Injectable()
export class CreateFilmHandler
  implements ICommandHandler<CreateFilmCommand, FilmResponseDto>
{
  constructor(private readonly filmRepository: FilmRepository) {}

  async execute(command: CreateFilmCommand): Promise<FilmResponseDto> {
    const { dto } = command;

    // Validate business rules
    const existingFilm = await this.filmRepository.findByName(dto.name);
    if (existingFilm) {
      throw new ConflictException(
        `Film with name "${dto.name}" already exists`,
      );
    }

    // Create entity
    const film = this.filmRepository.create({
      name: dto.name,
      description: dto.description,
      status: dto.status,
    });

    // Save to database
    const savedFilm = await this.filmRepository.save(film);

    // Return response
    return new FilmResponseDto(savedFilm);
  }
}
