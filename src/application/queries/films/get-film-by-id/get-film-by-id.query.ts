import { IQuery } from '@nestjs/cqrs';

export class GetFilmByIdQuery implements IQuery {
  constructor(public readonly filmId: string) {}
}

