# NestJS CQRS Starter

> 🚀 A production-ready NestJS monolith with CQRS pattern - Ready to scale to microservices

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Migration to Microservices](#migration-to-microservices)

## ✨ Features

- ✅ **CQRS Pattern** - Separated Commands and Queries
- ✅ **Clean Architecture** - Domain-driven design with clear layer separation
- ✅ **TypeORM** - Database ORM with migrations
- ✅ **JWT Authentication** - Secure authentication with Passport
- ✅ **Swagger Documentation** - Auto-generated API docs
- ✅ **Validation** - Request validation with class-validator
- ✅ **Docker Support** - Docker compose for local development
- ✅ **TypeScript** - Full type safety
- ✅ **Path Aliases** - Clean imports with @ prefixes
- ✅ **Modular Structure** - Easy to extract modules to microservices

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                   │
│              (Controllers - Entry Points)                │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                     │
│                   (Business Logic)                       │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │    Commands      │      │       Queries          │  │
│  │   (Write Ops)    │      │      (Read Ops)        │  │
│  └──────────────────┘      └────────────────────────┘  │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                        │
│                 (Business Entities)                      │
│              User, Role, etc. Entities                   │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                    │
│              (Database Access - TypeORM)                 │
│                     Repositories                         │
└─────────────────────────────────────────────────────────┘
```

### CQRS Flow

```
Request → Controller → CommandBus/QueryBus → Handler → Repository → Database
```

**Commands** (Write operations):
- CreateUser
- UpdateUser
- DeleteUser

**Queries** (Read operations):
- GetUserById
- GetUsers (with filters & pagination)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo>
cd nestjs-cqrs-starter
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_cqrs_starter
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

4. **Start PostgreSQL (with Docker)**

```bash
docker-compose up -d
```

Or install PostgreSQL manually and create database:

```bash
createdb nestjs_cqrs_starter
```

5. **Run migrations**

```bash
npm run migration:run
```

6. **Start the application**

```bash
npm run start:dev
```

Application will be running on: http://localhost:3000

## 📁 Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
│
├── presentation/                    # Controllers (Entry points)
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   └── strategies/
│   └── users/
│       ├── users.controller.ts
│       └── users.module.ts
│
├── application/                     # Business Logic (CQRS)
│   ├── commands/                    # Write operations
│   │   └── users/
│   │       ├── create-user/
│   │       │   ├── create-user.command.ts
│   │       │   ├── create-user.handler.ts
│   │       │   └── index.ts
│   │       ├── update-user/
│   │       └── delete-user/
│   │
│   └── queries/                     # Read operations
│       └── users/
│           ├── get-user-by-id/
│           │   ├── get-user-by-id.query.ts
│           │   ├── get-user-by-id.handler.ts
│           │   └── index.ts
│           └── get-users/
│
├── domain/                          # Domain Layer
│   └── entities/
│       ├── base.entity.ts
│       └── user.entity.ts
│
├── infrastructure/                  # Data Access Layer
│   ├── database/
│   │   ├── typeorm.config.ts
│   │   ├── typeorm-config.service.ts
│   │   └── migrations/
│   │
│   └── repositories/
│       ├── base.repository.ts
│       └── user.repository.ts
│
└── shared/                          # Shared Resources
    └── dtos/
        ├── auth/
        ├── users/
        └── pagination.dto.ts
```

### Path Aliases

```typescript
@app/*          → src/*
@presentation/* → src/presentation/*
@application/*  → src/application/*
@domain/*       → src/domain/*
@infrastructure/* → src/infrastructure/*
@shared/*       → src/shared/*
```

## 📖 API Documentation

Once the application is running, visit:

**Swagger UI**: http://localhost:3000/api/docs

### Available Endpoints

#### Authentication

```
POST /api/v1/auth/register   - Register new user
POST /api/v1/auth/login      - Login
POST /api/v1/auth/validate   - Validate token
```

#### Users

```
POST   /api/v1/users         - Create user
GET    /api/v1/users         - Get all users (with filters)
GET    /api/v1/users/:id     - Get user by ID
PUT    /api/v1/users/:id     - Update user
DELETE /api/v1/users/:id     - Delete user
```

### Example Usage

1. **Register a new user**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'
```

2. **Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

3. **Get users (with auth)**

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Build
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run migration:generate # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Lint code
npm run format             # Format code with Prettier

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run e2e tests
```

### Adding a New Feature Module

1. **Create folder structure**

```bash
mkdir -p src/application/commands/products
mkdir -p src/application/queries/products
mkdir -p src/presentation/products
mkdir -p src/domain/entities
```

2. **Create Entity**

```typescript
// src/domain/entities/product.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;
  
  @Column('decimal')
  price: number;
}
```

3. **Create Repository**

```typescript
// src/infrastructure/repositories/product.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Product } from '@domain/entities/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource);
  }
}
```

4. **Create Command/Query**

Follow the pattern in `src/application/commands/users/` or `src/application/queries/users/`

5. **Create Controller**

Follow the pattern in `src/presentation/users/users.controller.ts`

6. **Create Module**

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './products.controller';
import { ProductRepository } from '@infrastructure/repositories';
// Import handlers...

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [ProductRepository, ...CommandHandlers, ...QueryHandlers],
})
export class ProductsModule {}
```

7. **Register in AppModule**

```typescript
// src/app.module.ts
@Module({
  imports: [
    // ... other imports
    ProductsModule,
  ],
})
export class AppModule {}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔄 Migration to Microservices

This architecture is designed to easily extract modules into microservices:

### Step 1: Identify Bounded Context

Each feature module (Users, Products, Orders) is already isolated:

```
src/
├── application/
│   ├── commands/users/
│   └── queries/users/
├── domain/entities/user.entity.ts
└── infrastructure/repositories/user.repository.ts
```

### Step 2: Extract to Microservice

1. Copy module folder structure
2. Add message broker (NATS, RabbitMQ, Kafka)
3. Replace HTTP controllers with message patterns
4. Keep same Command/Query handlers
5. Use same database or separate DB

### Example: User Microservice

```typescript
// Before (Monolith)
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }
}

// After (Microservice)
@Controller()
export class UsersController {
  @MessagePattern('user.create')  // NATS/RabbitMQ
  create(@Payload() dto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }
}
```

**No change in Handlers, Repositories, or Entities!**

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [CQRS Pattern](https://docs.nestjs.com/recipes/cqrs)
- [TypeORM](https://typeorm.io)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Coding! 🚀**

