import { ICommand } from '@nestjs/cqrs';
import { UpdateCategoryDto } from '@shared/dtos/categories';

export class UpdateCategoryCommand implements ICommand {
  constructor(
    public readonly categoryId: string,
    public readonly dto: UpdateCategoryDto,
  ) {}
}
