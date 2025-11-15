import { ICommand } from '@nestjs/cqrs';
import { CreateCategoryDto } from '@shared/dtos/categorys';

export class CreateCategoryCommand implements ICommand {
  constructor(public readonly dto: CreateCategoryDto) {}
}

