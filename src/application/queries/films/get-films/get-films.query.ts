import { IQuery } from '@nestjs/cqrs';
import { GetFilmsQueryDto } from '@shared/dtos/films';

export class GetFilmsQuery implements IQuery {
  constructor(public readonly queryDto: GetFilmsQueryDto) {}
}

