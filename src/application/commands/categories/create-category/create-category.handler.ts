import { Injectable, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { UserRepository } from '@infrastructure/repositories';
import { CategoryResponseDto } from '@shared/dtos/categories';

@CommandHandler(CreateCategoryCommand)
@Injectable()
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand, CategoryResponseDto>
{
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<CategoryResponseDto> {
    const { dto, userId } = command;

    // Validate business rules
    const existingCategory = await this.categoryRepository.findByName(dto.name);
    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${dto.name}" already exists`,
      );
    }

    // Get user entity
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create entity
    const category = this.categoryRepository.create({
      name: dto.name,
      description: dto.description,
      status: dto.status,
      type: dto.type,
      Icon: dto.Icon,
      isDefault: dto.isDefault ?? false,
      userId: userId,
    });

    // Save to database
    const savedCategory = await this.categoryRepository.save(category);

    // Return response
    return new CategoryResponseDto({
      ...savedCategory,
      userId: savedCategory.userId,
    });
  }
}
