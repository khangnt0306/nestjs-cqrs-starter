import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { UserRepository } from '@infrastructure/repositories';

// Command Handlers
import {
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
} from '@application/commands/categories';

// Query Handlers
import {
  GetCategoryByIdHandler,
  GetCategoriesHandler,
} from '@application/queries/categories';
import { GetCategoriesSelfHandler } from '@application/queries/categories/get-categories-self/get-categories.handler';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

const QueryHandlers = [
  GetCategoryByIdHandler,
  GetCategoriesHandler,
  GetCategoriesSelfHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CategoriesController],
  providers: [
    CategoryRepository,
    UserRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
