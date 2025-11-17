import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/database/typeorm-config.service';
import { UsersModule } from './presentation/users/users.module';
import { AuthModule } from './presentation/auth/auth.module';
import { CategoriesModule } from './presentation/categories/categories.module';
import { PlansModule } from './presentation/plans/plans.module';
import { PlanItemsModule } from './presentation/plansItem/planItems.module';
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
    CategoriesModule,
    PlansModule,
    PlanItemsModule,
  ],
})
export class AppModule {}
