import { ICommand } from '@nestjs/cqrs';
import { UpdateCategoryDto } from '@shared/dtos/categorys';

export class UpdateCategoryCommand implements ICommand {
  constructor(
    public readonly categoryId: string,
    public readonly dto: UpdateCategoryDto,
  ) {}
}

