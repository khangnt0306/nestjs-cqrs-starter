import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UserRepository } from '@infrastructure/repositories';
import { UserResponseDto } from '@shared/dtos/users';
import { PaginationResponseDto } from '@shared/dtos/pagination.dto';

export class GetUsersResponseDto {
  users: UserResponseDto[];
  pagination: PaginationResponseDto;

  constructor(users: UserResponseDto[], pagination: PaginationResponseDto) {
    this.users = users;
    this.pagination = pagination;
  }
}

@QueryHandler(GetUsersQuery)
@Injectable()
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, GetUsersResponseDto>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<GetUsersResponseDto> {
    const { queryDto } = query;
    const { skip = 0, limit = 10, textSearch, filter = {} } = queryDto;

    const [users, total] = await this.userRepository.getUsersWithFilters(
      filter,
      { skip, limit },
      textSearch,
    );

    const userDtos = users.map((user) => new UserResponseDto(user));
    const pagination = new PaginationResponseDto(total, skip, limit);

    return new GetUsersResponseDto(userDtos, pagination);
  }
}
