import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '@shared/dtos/users';

export class CreateUserCommand implements ICommand {
  constructor(public readonly dto: CreateUserDto) {}
}
