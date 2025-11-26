import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from '@shared/dtos/users';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly dto: RegisterUserDto) {}
}
