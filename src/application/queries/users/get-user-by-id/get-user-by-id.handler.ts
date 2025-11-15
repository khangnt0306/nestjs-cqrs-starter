import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserRepository } from '@infrastructure/repositories';
import { UserResponseDto } from '@shared/dtos/users';

@QueryHandler(GetUserByIdQuery)
@Injectable()
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, UserResponseDto>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponseDto> {
    const { userId } = query;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }
}
