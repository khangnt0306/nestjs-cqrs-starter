import {
  Injectable,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { RegisterUserCommand } from './register-user.command';
import { UserRepository } from '@infrastructure/repositories';
import { MailService } from '@infrastructure/mail';
import { renderWelcomeTemplate } from '@infrastructure/mail';
import { UserResponseDto } from '@shared/dtos/users';
import { UserRole, UserStatus } from '@domain/entities/user/user.enum';
import { buildHttpExceptionResponse } from '@shared/utils';

@CommandHandler(RegisterUserCommand)
@Injectable()
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, UserResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    const { dto } = command;

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        buildHttpExceptionResponse(HttpStatus.CONFLICT, [
          'Email đã được sử dụng',
        ]),
      );
    }

    try {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

      const user = this.userRepository.create({
        ...dto,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.INACTIVE,
      });

      const savedUser = await this.userRepository.save(user);

      const response = new UserResponseDto({
        ...savedUser,
        password: undefined,
      });

      const welcomeTemplate = renderWelcomeTemplate({
        userId: savedUser.id,
        fullName: savedUser.full_name || savedUser.email,
      });

      await this.mailService.sendMail({
        to: savedUser.email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
        text: welcomeTemplate.text,
      });

      return response;
    } catch (error) {
      throw new BadRequestException(
        buildHttpExceptionResponse(HttpStatus.BAD_REQUEST, [
          'Lỗi khi đăng ký tài khoản',
        ]),
      );
    }
  }
}
