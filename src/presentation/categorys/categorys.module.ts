import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategorysController } from './categorys.controller';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';

// Command Handlers
import {
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
} from '@application/commands/categorys';

// Query Handlers
import {
  GetCategoryByIdHandler,
  GetCategorysHandler,
} from '@application/queries/categorys';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

const QueryHandlers = [
  GetCategoryByIdHandler,
  GetCategorysHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CategorysController],
  providers: [CategoryRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [CategoryRepository],
})
export class CategorysModule {}

