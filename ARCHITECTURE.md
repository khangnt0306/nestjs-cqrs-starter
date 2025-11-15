# Architecture Guide - NestJS CQRS Starter

## Tổng Quan Kiến Trúc

Dự án này sử dụng **Clean Architecture** kết hợp với **CQRS Pattern**, được thiết kế đặc biệt để:
- Dễ dàng maintain và scale
- Sẵn sàng tách thành microservices khi cần
- Tách biệt rõ ràng giữa Read và Write operations
- Test được từng layer độc lập

## Cấu Trúc 4 Layers

### 1. PRESENTATION LAYER (Controllers)

**Vai trò**: Entry point của application, nhận request và trả response

**Đặc điểm**:
- ✅ Không chứa business logic
- ✅ Chỉ validate DTO và routing
- ✅ Sử dụng CommandBus/QueryBus để gọi handlers

**Ví dụ**:

```typescript
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    // Chỉ routing, không có logic
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  @Get()
  async findAll(@Query() queryDto: GetUsersQueryDto) {
    // Chỉ routing, không có logic
    return this.queryBus.execute(new GetUsersQuery(queryDto));
  }
}
```

### 2. APPLICATION LAYER (Business Logic)

**Vai trò**: Chứa toàn bộ business logic, xử lý Commands và Queries

**Cấu trúc**:

```
application/
├── commands/              # Write operations (Create, Update, Delete)
│   └── users/
│       ├── create-user/
│       │   ├── create-user.command.ts    # Command object
│       │   ├── create-user.handler.ts    # Business logic
│       │   └── index.ts
│       ├── update-user/
│       └── delete-user/
│
└── queries/               # Read operations (Get, List)
    └── users/
        ├── get-user-by-id/
        │   ├── get-user-by-id.query.ts   # Query object
        │   ├── get-user-by-id.handler.ts # Business logic
        │   └── index.ts
        └── get-users/
```

**Command Handler Example**:

```typescript
@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserResponseDto>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    // 1. Validate business rules
    const existingUser = await this.userRepository.findByEmail(command.dto.email);
    if (existingUser) {
      throw new ConflictException('User exists');
    }

    // 2. Process business logic
    const hashedPassword = await bcrypt.hash(command.dto.password, 10);
    
    // 3. Save to database
    const user = await this.userRepository.save({
      ...command.dto,
      password: hashedPassword,
    });

    // 4. Return result
    return new UserResponseDto(user);
  }
}
```

**Query Handler Example**:

```typescript
@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, GetUsersResult>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<GetUsersResult> {
    // 1. Get data from database
    const [users, total] = await this.userRepository.getUsersWithFilters(
      query.queryDto.filter,
      { skip: query.queryDto.skip, limit: query.queryDto.limit },
      query.queryDto.textSearch,
    );

    // 2. Transform and return
    return {
      docs: users.map(user => new UserResponseDto(user)),
      paging: new PaginationResponseDto(total, skip, limit),
    };
  }
}
```

### 3. DOMAIN LAYER (Entities)

**Vai trò**: Định nghĩa business objects và domain rules

**Đặc điểm**:
- ✅ Pure domain objects
- ✅ Không phụ thuộc vào infrastructure
- ✅ Business constraints được định nghĩa ở entity level

**Example**:

```typescript
@Entity('users')
export class User extends BaseEntity {
  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;
}
```

### 4. INFRASTRUCTURE LAYER (Repositories)

**Vai trò**: Data access và database operations

**Đặc điểm**:
- ✅ Kế thừa BaseRepository
- ✅ Custom query methods
- ✅ TypeORM QueryBuilder cho complex queries

**Example**:

```typescript
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async getUsersWithFilters(
    filter: GetUsersFilter,
    paging: PagingOptions,
    textSearch?: string,
  ): Promise<[User[], number]> {
    let qb = this.createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    if (textSearch) {
      qb = qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${textSearch}%` },
      );
    }

    if (filter.status) {
      qb = qb.andWhere('user.status = :status', { status: filter.status });
    }

    qb = qb.skip(paging.skip).take(paging.limit);
    qb = qb.orderBy('user.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
```

## CQRS Pattern Chi Tiết

### Command Flow (Write Operations)

```
1. Client sends POST /users
   ↓
2. UsersController.create(dto)
   ↓
3. commandBus.execute(new CreateUserCommand(dto))
   ↓
4. CreateUserHandler.execute(command)
   ↓
5. - Validate business rules
   - Transform data
   - userRepository.save(user)
   ↓
6. Return UserResponseDto
```

### Query Flow (Read Operations)

```
1. Client sends GET /users?skip=0&limit=10
   ↓
2. UsersController.findAll(queryDto)
   ↓
3. queryBus.execute(new GetUsersQuery(queryDto))
   ↓
4. GetUsersHandler.execute(query)
   ↓
5. - userRepository.getUsersWithFilters()
   - Transform to DTOs
   ↓
6. Return { docs: [], paging: {} }
```

### Tại Sao Tách Command và Query?

**Benefits**:
1. **Tách biệt concerns**: Read và Write logic độc lập
2. **Scalability**: Có thể scale read và write riêng biệt
3. **Optimization**: Query có thể optimize riêng (caching, read replicas)
4. **Security**: Phân quyền rõ ràng hơn
5. **Maintainability**: Dễ tìm và sửa logic

## Dependency Injection Flow

```typescript
// Module registration
@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreateUserHandler,    // Command handler
    GetUsersHandler,      // Query handler
  ],
})
export class UsersModule {}
```

**DI Container sẽ**:
1. Tạo instance của UserRepository
2. Inject vào các Handlers
3. Register Handlers với CommandBus/QueryBus
4. Inject CommandBus/QueryBus vào Controllers

## DTO Pattern

### Request DTOs (Validation)

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;
}
```

### Response DTOs (Transformation)

```typescript
export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  
  @Exclude()  // Không trả password về client
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
```

## Authentication Flow

```
1. POST /auth/login { email, password }
   ↓
2. AuthService.validateUser()
   - userRepository.findByEmail()
   - bcrypt.compare(password)
   ↓
3. Generate JWT token
   - payload: { sub: userId, email, role }
   - jwtService.sign(payload)
   ↓
4. Return { accessToken, user }
   ↓
5. Client stores token
   ↓
6. Client sends request with header:
   Authorization: Bearer <token>
   ↓
7. JwtAuthGuard validates token
   - JwtStrategy.validate()
   - Extract user info
   ↓
8. Request.user is populated
```

## Migration to Microservices

### Hiện Tại (Monolith)

```
┌─────────────────────────────────────┐
│          Single Application         │
│  ┌─────────┐  ┌──────────┐         │
│  │  Users  │  │ Products │         │
│  └─────────┘  └──────────┘         │
│         ↓            ↓              │
│     ┌──────────────────┐           │
│     │  Single Database │           │
│     └──────────────────┘           │
└─────────────────────────────────────┘
```

### Sau Khi Tách (Microservices)

```
┌─────────────────┐    ┌──────────────────┐
│  User Service   │    │ Product Service  │
│  ┌─────────┐    │    │  ┌──────────┐    │
│  │  Users  │    │    │  │ Products │    │
│  └─────────┘    │    │  └──────────┘    │
│       ↓         │    │        ↓         │
│  ┌─────────┐    │    │  ┌──────────┐    │
│  │ User DB │    │    │  │Product DB│    │
│  └─────────┘    │    │  └──────────┘    │
└────────┬────────┘    └─────────┬────────┘
         │                       │
         └───────┬───────────────┘
                 │
          ┌──────▼──────┐
          │ Message Bus │
          │ (NATS/Kafka)│
          └─────────────┘
```

### Steps to Extract a Module

1. **Copy module structure** từ monolith
2. **Add message broker** (NATS, RabbitMQ, Kafka)
3. **Replace HTTP with Message Patterns**:

```typescript
// Before (HTTP)
@Post()
create(@Body() dto: CreateUserDto) {
  return this.commandBus.execute(new CreateUserCommand(dto));
}

// After (Microservice)
@MessagePattern('user.create')
create(@Payload() dto: CreateUserDto) {
  return this.commandBus.execute(new CreateUserCommand(dto));
}
```

4. **Handlers, Repositories, Entities không thay đổi!**
5. **Deploy độc lập**

## Best Practices

### 1. Handlers

✅ **DO**:
- Một Handler chỉ xử lý một Command/Query
- Business logic nằm trong Handler
- Return DTO, không return Entity trực tiếp

❌ **DON'T**:
- Gọi Handler từ Handler khác
- Chứa infrastructure code trong Handler

### 2. Repositories

✅ **DO**:
- Custom methods cho complex queries
- Use QueryBuilder cho queries phức tạp
- Return Entity hoặc [Entity[], count]

❌ **DON'T**:
- Business logic trong Repository
- Direct database queries outside Repository

### 3. DTOs

✅ **DO**:
- Một DTO cho mỗi use case
- Validation decorators
- Transform decorators

❌ **DON'T**:
- Reuse DTOs cho nhiều purposes khác nhau
- Return Entity trực tiếp từ Controller

### 4. Entities

✅ **DO**:
- Business constraints ở entity level
- TypeORM decorators
- Enum cho fixed values

❌ **DON'T**:
- Infrastructure dependencies trong Entity
- Business logic methods trong Entity (nếu dùng pure DDD thì OK, nhưng pattern này ít dùng)

## Performance Tips

### 1. Database Queries

```typescript
// ❌ N+1 Problem
const users = await this.userRepository.find();
for (const user of users) {
  user.roles = await this.roleRepository.findByUserId(user.id);
}

// ✅ Use Relations
const users = await this.userRepository.find({
  relations: ['roles'],
});
```

### 2. Pagination

```typescript
// Always use skip/take
const qb = this.createQueryBuilder('user')
  .skip(skip)
  .take(limit);
```

### 3. Indexing

```typescript
@Entity()
export class User {
  @Index()  // Add index for frequently queried fields
  @Column()
  email: string;
}
```

## Testing Strategy

### Unit Tests (Handlers)

```typescript
describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let repository: MockType<UserRepository>;

  beforeEach(() => {
    repository = createMock<UserRepository>();
    handler = new CreateUserHandler(repository);
  });

  it('should create user', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.save.mockResolvedValue(mockUser);

    const result = await handler.execute(command);
    
    expect(result).toEqual(mockUser);
    expect(repository.save).toHaveBeenCalled();
  });
});
```

### E2E Tests

```typescript
describe('UsersController (e2e)', () => {
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);
  });
});
```

## Kết Luận

Kiến trúc này cung cấp:
- ✅ Separation of Concerns rõ ràng
- ✅ Scalability và Maintainability cao
- ✅ Dễ dàng migrate sang Microservices
- ✅ Testable và flexible
- ✅ Production-ready

**Bắt đầu với monolith, tách ra microservices khi cần!**

