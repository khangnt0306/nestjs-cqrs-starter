import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FilmsController } from './films.controller';
import { FilmRepository } from '@infrastructure/repositories/film.repository';

// Command Handlers
import {
  CreateFilmHandler,
  UpdateFilmHandler,
  DeleteFilmHandler,
} from '@application/commands/films';

// Query Handlers
import {
  GetFilmByIdHandler,
  GetFilmsHandler,
} from '@application/queries/films';

const CommandHandlers = [
  CreateFilmHandler,
  UpdateFilmHandler,
  DeleteFilmHandler,
];

const QueryHandlers = [GetFilmByIdHandler, GetFilmsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [FilmsController],
  providers: [FilmRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [FilmRepository],
})
export class FilmsModule {}
