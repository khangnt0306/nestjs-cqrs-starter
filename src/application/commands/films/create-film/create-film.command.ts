import { ICommand } from '@nestjs/cqrs';
import { CreateFilmDto } from '@shared/dtos/films';

export class CreateFilmCommand implements ICommand {
  constructor(public readonly dto: CreateFilmDto) {}
}
