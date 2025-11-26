import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@infrastructure/repositories';
import { LoginDto, LoginResponseDto } from '@shared/dtos/auth';
import { RegisterUserDto, UserResponseDto } from '@shared/dtos/users';
import { RegisterUserCommand } from '@application/commands/users';
import { UserStatus } from '@domain/entities/user/user.enum';
import { buildHttpExceptionResponse } from '@shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        buildHttpExceptionResponse(HttpStatus.UNAUTHORIZED, [
          'Người dùng không tồn tại',
        ]),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        buildHttpExceptionResponse(HttpStatus.UNAUTHORIZED, [
          'Mật khẩu không chính xác',
        ]),
      );
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        buildHttpExceptionResponse(HttpStatus.UNAUTHORIZED, [
          'Tài khoản chưa được kích hoạt',
        ]),
      );
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    return this.commandBus.execute(new RegisterUserCommand(registerUserDto));
  }
}
