import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFilmCommand } from './delete-film.command';
import { FilmRepository } from '@infrastructure/repositories/film.repository';

@CommandHandler(DeleteFilmCommand)
@Injectable()
export class DeleteFilmHandler
  implements ICommandHandler<DeleteFilmCommand, void>
{
  constructor(private readonly filmRepository: FilmRepository) {}

  async execute(command: DeleteFilmCommand): Promise<void> {
    const { filmId } = command;

    // Find film
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
    });
    if (!film) {
      throw new NotFoundException(`Film with ID "${filmId}" not found`);
    }

    // Soft delete
    await this.filmRepository.softRemove(film);
  }
}
