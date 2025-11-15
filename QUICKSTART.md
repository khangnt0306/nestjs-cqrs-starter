# Quick Start Guide

## 🚀 Khởi Động Nhanh (5 phút)

### Bước 1: Cài đặt dependencies

```bash
cd ~/Documents/nestjs-cqrs-starter
npm install
```

### Bước 2: Khởi động Database

**Option A: Sử dụng Docker (Khuyên dùng)**

```bash
docker-compose up -d
```

**Option B: PostgreSQL đã cài sẵn**

```bash
# Tạo database
createdb nestjs_cqrs_starter

# Hoặc qua psql
psql -U postgres
CREATE DATABASE nestjs_cqrs_starter;
\q
```

### Bước 3: Kiểm tra file .env

File `.env` đã được tạo sẵn với config mặc định:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_cqrs_starter
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

> ⚠️ **Lưu ý**: Nếu PostgreSQL của bạn dùng user/password khác, hãy sửa trong file `.env`

### Bước 4: Chạy migrations (Tự động tạo bảng)

```bash
npm run migration:run
```

> 💡 Nếu chưa có migration, sử dụng synchronize tự động:
> Trong `.env` set `NODE_ENV=development` (đã được set sẵn)

### Bước 5: Khởi động application

```bash
npm run start:dev
```

Chờ thông báo:

```
🚀 Application is running on: http://localhost:3000
📚 Swagger docs: http://localhost:3000/api/docs
```

---

## ✅ Test API

### 1. Mở Swagger UI

Truy cập: http://localhost:3000/api/docs

### 2. Test bằng cURL

**a) Đăng ký user**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "name": "Admin User",
    "role": "admin",
    "status": "active"
  }'
```

Response:

```json
{
  "id": "uuid-here",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "status": "active",
  "createdAt": "2024-..."
}
```

**b) Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

Response:

```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": "7d",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**c) Lấy danh sách users (cần token)**

```bash
# Lưu token vào biến
TOKEN="eyJhbGc..."

curl -X GET "http://localhost:3000/api/v1/users?skip=0&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "docs": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "status": "active"
    }
  ],
  "paging": {
    "total": 1,
    "skip": 0,
    "limit": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

---

## 📁 Cấu Trúc Dự Án

```
nestjs-cqrs-starter/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── presentation/              # Controllers
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── guards/
│   │   └── users/
│   │       ├── users.controller.ts
│   │       └── users.module.ts
│   │
│   ├── application/               # CQRS - Business Logic
│   │   ├── commands/
│   │   │   └── users/
│   │   │       ├── create-user/  # ✍️ Tạo user
│   │   │       ├── update-user/  # ✍️ Sửa user
│   │   │       └── delete-user/  # ✍️ Xóa user
│   │   │
│   │   └── queries/
│   │       └── users/
│   │           ├── get-user-by-id/  # 📖 Lấy 1 user
│   │           └── get-users/       # 📖 Lấy danh sách
│   │
│   ├── domain/                    # Entities
│   │   └── entities/
│   │       ├── base.entity.ts
│   │       └── user.entity.ts
│   │
│   ├── infrastructure/            # Database
│   │   ├── database/
│   │   └── repositories/
│   │       └── user.repository.ts
│   │
│   └── shared/                    # DTOs, Utils
│       └── dtos/
│           ├── auth/
│           ├── users/
│           └── pagination.dto.ts
│
├── .env                           # Config (đã tạo)
├── docker-compose.yml             # PostgreSQL
├── README.md                      # Hướng dẫn đầy đủ
├── ARCHITECTURE.md                # Giải thích kiến trúc
└── package.json                   # Dependencies
```

---

## 🎯 Luồng Hoạt Động CQRS

### Create User (Command)

```
Client → POST /users
  ↓
UsersController.create()
  ↓
CommandBus.execute(CreateUserCommand)
  ↓
CreateUserHandler.execute()
  ↓
  1. Validate (check email exists)
  2. Hash password
  3. UserRepository.save()
  ↓
Return UserResponseDto
```

### Get Users (Query)

```
Client → GET /users?skip=0&limit=10
  ↓
UsersController.findAll()
  ↓
QueryBus.execute(GetUsersQuery)
  ↓
GetUsersHandler.execute()
  ↓
  1. UserRepository.getUsersWithFilters()
  2. Transform to DTOs
  ↓
Return { docs: [], paging: {} }
```

---

## 🔧 Lệnh Hữu Ích

```bash
# Development
npm run start:dev          # Dev mode với watch

# Database
npm run migration:generate # Tạo migration mới
npm run migration:run      # Chạy migrations
npm run migration:revert   # Rollback

# Code Quality
npm run lint              # Kiểm tra lỗi
npm run format            # Format code

# Testing
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Build
npm run build             # Build cho production
npm run start:prod        # Chạy production
```

---

## 🆘 Troubleshooting

### Lỗi: "Cannot connect to database"

```bash
# Kiểm tra PostgreSQL đang chạy
docker ps  # Nếu dùng Docker

# Hoặc
psql -U postgres -h localhost -p 5432

# Check file .env
cat .env  # Xem config DB
```

### Lỗi: "Port 3000 already in use"

```bash
# Đổi port trong .env
PORT=3001

# Hoặc kill process đang dùng port
lsof -ti:3000 | xargs kill -9
```

### Lỗi: "Module not found"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Học Thêm

- [README.md](./README.md) - Hướng dẫn đầy đủ
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Chi tiết kiến trúc
- Swagger UI: http://localhost:3000/api/docs

---

## ✨ Next Steps

### 1. Thêm Module Mới

Ví dụ: Module Products

```bash
# Tạo folders
mkdir -p src/application/commands/products/create-product
mkdir -p src/application/queries/products/get-products
mkdir -p src/presentation/products
mkdir -p src/domain/entities
```

### 2. Tích Hợp Thêm

- [ ] Redis cache
- [ ] File upload (S3, local)
- [ ] Email service
- [ ] Socket.io
- [ ] GraphQL
- [ ] Kafka/RabbitMQ

### 3. Deploy

- [ ] Docker build
- [ ] Kubernetes
- [ ] CI/CD
- [ ] Monitoring

---

**Happy Coding! 🚀**

