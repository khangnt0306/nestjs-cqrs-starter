import { IQuery } from '@nestjs/cqrs';
import { GetUsersQueryDto } from '@shared/dtos/users';

export class GetUsersQuery implements IQuery {
  constructor(public readonly queryDto: GetUsersQueryDto) {}
}
