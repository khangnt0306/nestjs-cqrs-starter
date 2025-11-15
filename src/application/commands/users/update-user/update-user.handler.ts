import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '@infrastructure/repositories';
import { UserResponseDto } from '@shared/dtos/users';

@CommandHandler(UpdateUserCommand)
@Injectable()
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, UserResponseDto>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserResponseDto> {
    const { userId, dto } = command;

    // Find user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Update fields
      Object.assign(user, dto);

      // Hash password if provided
      if (dto.password) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
        user.password = await bcrypt.hash(dto.password, saltRounds);
      }

      // Update timestamp
      user.updatedAt = new Date();

      // Save to database
      const updatedUser = await this.userRepository.save(user);

      // Return response without password
      return new UserResponseDto(updatedUser);
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }
}
