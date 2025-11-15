import { ICommand } from '@nestjs/cqrs';
import { UpdateFilmDto } from '@shared/dtos/films';

export class UpdateFilmCommand implements ICommand {
  constructor(
    public readonly filmId: string,
    public readonly dto: UpdateFilmDto,
  ) {}
}
