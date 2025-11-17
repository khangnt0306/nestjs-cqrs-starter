import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '@infrastructure/repositories';
import { UserResponseDto } from '@shared/dtos/users';

@CommandHandler(CreateUserCommand)
@Injectable()
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserResponseDto>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { dto } = command;

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

      // Create user
      const user = this.userRepository.create({
        ...dto,
        password: hashedPassword,
      });

      // Save to database
      const savedUser = await this.userRepository.save(user);

      // Return response without password
      return new UserResponseDto({
        ...savedUser,
        password: undefined,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
