import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { UserRepository } from '@infrastructure/repositories';

// Command Handlers
import {
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
} from '@application/commands/users';

// Query Handlers
import {
  GetUserByIdHandler,
  GetUsersHandler,
} from '@application/queries/users';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const QueryHandlers = [GetUserByIdHandler, GetUsersHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UserRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [UserRepository],
})
export class UsersModule {}
