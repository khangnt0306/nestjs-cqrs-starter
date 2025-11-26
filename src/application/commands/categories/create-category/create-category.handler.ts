import {
  Injectable,
  ConflictException,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { UserRepository } from '@infrastructure/repositories';
import { CategoryResponseDto } from '@shared/dtos/categories';
import { UserRole } from '@domain/entities/user/user.enum';
import { buildHttpExceptionResponse } from '@shared/utils';

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
        buildHttpExceptionResponse(HttpStatus.CONFLICT, [
          `Danh mục với tên "${dto.name}" đã tồn tại`,
        ]),
      );
    }

    // Get user entity
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        buildHttpExceptionResponse(HttpStatus.NOT_FOUND, [
          'Người dùng không tồn tại',
        ]),
      );
    }

    // Validate: Only admin can create default categories
    const isAdmin = user.role === UserRole.ADMIN;
    const isDefault = dto.isDefault ?? false;

    if (isDefault && !isAdmin) {
      throw new BadRequestException(
        buildHttpExceptionResponse(HttpStatus.BAD_REQUEST, [
          'Chỉ admin mới có thể tạo danh mục mặc định',
        ]),
      );
    }

    // Create entity
    // For default categories: userId can be null or admin id
    // For self categories: userId = user id, isDefault = false
    const category = this.categoryRepository.create({
      name: dto.name,
      description: dto.description,
      status: dto.status,
      type: dto.type,
      Icon: dto.Icon,
      isDefault: isDefault,
      userId: isDefault ? null : userId,
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
