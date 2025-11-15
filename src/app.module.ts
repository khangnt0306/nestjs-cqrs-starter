import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/database/typeorm-config.service';
import { UsersModule } from './presentation/users/users.module';
import { AuthModule } from './presentation/auth/auth.module';
import { PostsModule } from './presentation/post/posts.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // CQRS
    CqrsModule.forRoot(),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
