import { CreateCategoryDto } from '@shared/dtos/categories';
import { ICommand } from '@nestjs/cqrs';

export class CreateCategoryCommand implements ICommand {
  constructor(
    public readonly dto: CreateCategoryDto,
    public readonly userId: string,
  ) {}
}
