import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CategoryResponseDto } from '@shared/dtos/categories';

@CommandHandler(UpdateCategoryCommand)
@Injectable()
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand, CategoryResponseDto>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryResponseDto> {
    const { categoryId, dto } = command;

    // Find category
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    // Check name duplicate if name is changed
    if (dto.name && dto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(
        dto.name,
      );
      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${dto.name}" already exists`,
        );
      }
    }

    // Update fields
    Object.assign(category, dto);

    // Save
    const updatedCategory = await this.categoryRepository.save(category);

    // Return response
    return new CategoryResponseDto(updatedCategory);
  }
}
