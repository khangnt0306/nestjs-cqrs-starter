import { ICommand } from '@nestjs/cqrs';

export class DeleteFilmCommand implements ICommand {
  constructor(public readonly filmId: string) {}
}
