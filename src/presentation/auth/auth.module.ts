import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '@infrastructure/repositories';
import { MailService } from '@infrastructure/mail';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OwnerGuard } from './guards/owner.guard';
import { ResourceOwnerGuard } from './guards/resource-owner.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import { RolesGuard } from './guards/roles.guard';

// Import handlers
import {
  CreateUserHandler,
  RegisterUserHandler,
} from '@application/commands/users';

@Global()
@Module({
  imports: [
    PassportModule,
    CqrsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-super-secret-jwt-key',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    CreateUserHandler,
    RegisterUserHandler,
    MailService,
    // Export guards để sử dụng global
    JwtAuthGuard,
    OwnerGuard,
    ResourceOwnerGuard,
    OwnershipGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    MailService,
    // Export guards để các module khác có thể sử dụng
    JwtAuthGuard,
    OwnerGuard,
    ResourceOwnerGuard,
    OwnershipGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
