import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from '@shared/dtos/users';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly dto: UpdateUserDto,
  ) {}
}
