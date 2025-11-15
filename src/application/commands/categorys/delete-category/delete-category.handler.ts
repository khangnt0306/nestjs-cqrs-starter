import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';

@CommandHandler(DeleteCategoryCommand)
@Injectable()
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand, void>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const { categoryId } = command;

    // Find category
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID "${categoryId}" not found`,
      );
    }

    // Soft delete
    await this.categoryRepository.softRemove(category);
  }
}

