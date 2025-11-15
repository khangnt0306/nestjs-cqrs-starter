# 🚀 Plop Code Generator Guide

## Giới Thiệu

Plop là một công cụ tự động tạo code giúp bạn generate các module, command, query, DTO một cách nhanh chóng và nhất quán theo chuẩn kiến trúc CQRS của dự án.

## 📦 Cài Đặt

Plop đã được cài đặt sẵn trong dự án. Không cần cài thêm gì.

## 🎯 Các Generators Có Sẵn

### 1. **CQRS Module** (Full Stack)
Generate một module CQRS hoàn chỉnh với đầy đủ các layer:

```bash
yarn g:module
# hoặc
yarn generate cqrs-module
# hoặc
yarn g
```

**Sẽ tạo ra:**
- ✅ Entity (Domain layer)
- ✅ Repository (Infrastructure layer)
- ✅ DTOs (Create, Update, Get, Response)
- ✅ Commands (Create, Update, Delete) với Handlers
- ✅ Queries (GetById, GetList) với Handlers
- ✅ Controller (Presentation layer)
- ✅ Module (Presentation layer)

**Ví dụ:**
```bash
$ yarn g:module
? Module name (singular, e.g., "Film", "Product"): Film
```

**Kết quả:**
```
src/
├── domain/entities/film.entity.ts
├── infrastructure/repositories/film.repository.ts
├── shared/dtos/films/
│   ├── create-film.dto.ts
│   ├── update-film.dto.ts
│   ├── get-films.dto.ts
│   ├── film-response.dto.ts
│   └── index.ts
├── application/
│   ├── commands/films/
│   │   ├── create-film/
│   │   │   ├── create-film.command.ts
│   │   │   ├── create-film.handler.ts
│   │   │   └── index.ts
│   │   ├── update-film/...
│   │   ├── delete-film/...
│   │   └── index.ts
│   └── queries/films/
│       ├── get-film-by-id/...
│       ├── get-films/...
│       └── index.ts
└── presentation/films/
    ├── films.controller.ts
    └── films.module.ts
```

---

### 2. **Simple Module** (Service-based)
Generate một module đơn giản dùng Service thay vì CQRS:

```bash
yarn g:simple
# hoặc
yarn generate simple-module
```

**Sẽ tạo ra:**
- ✅ Entity
- ✅ Repository
- ✅ DTOs
- ✅ Service (thay vì Commands/Queries)
- ✅ Controller
- ✅ Module

**Khi nào dùng Simple Module?**
- Module nhỏ, logic đơn giản
- Không cần tách biệt Read/Write
- Prototype nhanh

---

### 3. **Single Command**
Tạo một Command riêng lẻ với Handler:

```bash
yarn g:command
# hoặc
yarn generate command
```

**Ví dụ:**
```bash
$ yarn g:command
? Module name (e.g., "users", "films"): users
? Command name (e.g., "SendEmail", "ProcessPayment"): SendWelcomeEmail
```

**Kết quả:**
```
src/application/commands/users/send-welcome-email/
├── send-welcome-email.command.ts
├── send-welcome-email.handler.ts
└── index.ts
```

**Sử dụng:**
```typescript
// 1. Import vào module
import { SendWelcomeEmailHandler } from '@application/commands/users';

@Module({
  providers: [
    // ... other handlers
    SendWelcomeEmailHandler,
  ],
})

// 2. Gọi từ controller hoặc handler khác
this.commandBus.execute(new SendWelcomeEmailCommand(userId, email));
```

---

### 4. **Single Query**
Tạo một Query riêng lẻ với Handler:

```bash
yarn g:query
# hoặc
yarn generate query
```

**Ví dụ:**
```bash
$ yarn g:query
? Module name (e.g., "users", "films"): films
? Query name (e.g., "GetUserStats", "GetFilmReviews"): GetFilmReviews
```

**Kết quả:**
```
src/application/queries/films/get-film-reviews/
├── get-film-reviews.query.ts
├── get-film-reviews.handler.ts
└── index.ts
```

---

### 5. **DTOs**
Tạo các DTO files (Create, Update, Response):

```bash
yarn g:dto
# hoặc
yarn generate dto
```

**Ví dụ:**
```bash
$ yarn g:dto
? DTO name (e.g., "User", "Film"): Category
```

**Kết quả:**
```
src/shared/dtos/categories/
├── create-category.dto.ts
├── update-category.dto.ts
└── category-response.dto.ts
```

---

## 📝 Workflow Sau Khi Generate

### Sau khi generate CQRS Module:

1. **Customize Entity**
```typescript
// src/domain/entities/film.entity.ts
// Thêm/sửa các fields theo yêu cầu
@Column({ type: 'int' })
releaseYear: number;

@Column({ type: 'decimal', precision: 3, scale: 1 })
rating: number;
```

2. **Update DTOs**
```typescript
// src/shared/dtos/films/create-film.dto.ts
// Thêm validation cho các fields mới
@IsInt()
@Min(1888)
releaseYear: number;
```

3. **Update Repository Filters** (nếu cần)
```typescript
// src/infrastructure/repositories/film.repository.ts
if (filter.releaseYear) {
  qb = qb.andWhere('film.releaseYear = :year', { year: filter.releaseYear });
}
```

4. **Register Module**
```typescript
// src/app.module.ts
import { FilmsModule } from './presentation/films/films.module';

@Module({
  imports: [
    // ... other modules
    FilmsModule,
  ],
})
```

5. **Generate và Run Migration**
```bash
yarn migration:generate src/migrations/CreateFilm
yarn migration:run
```

6. **Test API**
```bash
# Start server
yarn start:dev

# Truy cập Swagger
open http://localhost:3000/api
```

---

## 🎨 Naming Conventions

Plop tự động convert tên theo các format:

| Input | pascalCase | camelCase | kebabCase |
|-------|-----------|-----------|-----------|
| Film | Film | film | film |
| UserProfile | UserProfile | userProfile | user-profile |
| API_KEY | ApiKey | apiKey | api-key |

**Ví dụ thực tế:**
```bash
Input: "UserProfile"

Generated:
- Entity: UserProfile (PascalCase)
- File: user-profile.entity.ts (kebab-case)
- Variable: userProfile (camelCase)
- Endpoint: /user-profiles (kebab-case plural)
```

---

## 💡 Best Practices

### 1. Tên Module (Singular)
```bash
✅ ĐÚNG: Film, Product, User, Category
❌ SAI:  Films, Products, Users, Categories
```

### 2. Tên Command (Động từ + Danh từ)
```bash
✅ ĐÚNG: SendEmail, ProcessPayment, CalculateTotal
❌ SAI:  Email, Payment, Total
```

### 3. Tên Query (Get/Find + Thông tin)
```bash
✅ ĐÚNG: GetUserStats, FindActiveUsers, GetFilmReviews
❌ SAI:  UserStats, ActiveUsers, FilmReviews
```

### 4. Customize sau khi generate
- ❌ Không copy-paste y nguyên generated code
- ✅ Review và customize theo business logic
- ✅ Thêm validation rules phù hợp
- ✅ Update filters trong repository
- ✅ Thêm business rules trong handlers

---

## 🔧 Customization

### Thêm Generator Mới

1. Tạo template files trong `plop-templates/`
```
plop-templates/
└── my-custom-generator/
    ├── file1.hbs
    └── file2.hbs
```

2. Update `plopfile.js`
```javascript
plop.setGenerator('my-generator', {
  description: 'My custom generator',
  prompts: [...],
  actions: [...],
});
```

3. Thêm script trong `package.json`
```json
"scripts": {
  "g:custom": "plop my-generator"
}
```

### Modify Existing Templates

Edit files trong `plop-templates/` để thay đổi generated code:

```
plop-templates/
├── cqrs-module/
│   ├── entity.hbs          ← Edit để thay đổi entity template
│   ├── repository.hbs      ← Edit để thay đổi repository template
│   ├── controller.hbs      ← Edit để thay đổi controller template
│   └── ...
├── simple-module/
├── command/
├── query/
└── dto/
```

---

## 🐛 Troubleshooting

### Lỗi: "File already exists"
```bash
# Plop không overwrite files tồn tại
# Solution: Xóa file cũ hoặc rename
```

### Lỗi: Module không được tự động import
```bash
# Plop chỉ tạo files, không tự động import
# Solution: Manually import module vào app.module.ts
```

### Lỗi: TypeScript compilation errors
```bash
# Check imports và paths
# Solution: Update tsconfig.json paths nếu cần
```

---

## 📚 Examples

### Example 1: Tạo Film Module

```bash
# 1. Generate module
$ yarn g:module
? Module name: Film

# 2. Customize entity
# Edit: src/domain/entities/film.entity.ts
# Thêm: releaseYear, duration, rating, posterUrl

# 3. Update DTOs
# Edit các files trong src/shared/dtos/films/

# 4. Register module
# Edit: src/app.module.ts
import { FilmsModule } from './presentation/films/films.module';

# 5. Generate migration
$ yarn migration:generate src/migrations/CreateFilm

# 6. Run migration
$ yarn migration:run

# 7. Start & test
$ yarn start:dev
```

### Example 2: Thêm Command mới cho Users

```bash
# Generate command
$ yarn g:command
? Module name: users
? Command name: VerifyEmail

# Customize handler
# Edit: src/application/commands/users/verify-email/verify-email.handler.ts

# Register handler
# Edit: src/presentation/users/users.module.ts
import { VerifyEmailHandler } from '@application/commands/users';

@Module({
  providers: [
    // existing handlers...
    VerifyEmailHandler,
  ],
})

# Use trong controller
@Post(':id/verify-email')
async verifyEmail(@Param('id') id: string) {
  return this.commandBus.execute(new VerifyEmailCommand(id));
}
```

### Example 3: Thêm Query cho Statistics

```bash
# Generate query
$ yarn g:query
? Module name: users
? Query name: GetUserStatistics

# Implement logic
# Edit: src/application/queries/users/get-user-statistics/get-user-statistics.handler.ts

async execute(query: GetUserStatisticsQuery): Promise<any> {
  const stats = await this.userRepository
    .createQueryBuilder('user')
    .select('COUNT(*)', 'total')
    .addSelect('user.status', 'status')
    .groupBy('user.status')
    .getRawMany();
    
  return { stats };
}

# Register và use
# ... (tương tự command example)
```

---

## 🎓 Advanced Usage

### Generate Multiple Modules

```bash
# Script để generate nhiều modules
#!/bin/bash

modules=("Film" "Category" "Review" "Rating")

for module in "${modules[@]}"
do
  echo "$module" | yarn g:module
done
```

### Template Variables

Trong Handlebars templates, bạn có access đến:

```handlebars
{{pascalCase name}}    → Film
{{camelCase name}}     → film
{{kebabCase name}}     → film
{{lowerCase name}}     → film

{{pascalCase name}}s   → Films (plural)
{{camelCase name}}s    → films (plural)
```

### Conditional Generation

Trong `plopfile.js`:

```javascript
actions: (data) => {
  const actions = [
    // Always generated
    { type: 'add', path: '...', ... },
  ];
  
  // Conditional action
  if (data.withTests) {
    actions.push({
      type: 'add',
      path: 'src/.../{{name}}.spec.ts',
      templateFile: 'plop-templates/test.hbs',
    });
  }
  
  return actions;
}
```

---

## 📖 Resources

- [Plop Documentation](https://plopjs.com/)
- [Handlebars Syntax](https://handlebarsjs.com/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)

---

## ✨ Tips & Tricks

1. **Alias ngắn gọn**: Dùng `yarn g` thay vì `yarn generate`
2. **Tab completion**: Plop có interactive menu, dùng arrows và Enter
3. **Undo**: Nếu generate nhầm, chỉ cần xóa folder/files vừa tạo
4. **Version control**: Commit trước khi generate để dễ revert
5. **Code review**: Luôn review generated code trước khi dùng
6. **Customize templates**: Thường xuyên update templates theo team conventions

---

## 🎯 Summary

| Command | Description | Use When |
|---------|-------------|----------|
| `yarn g:module` | Full CQRS module | New feature, complex business logic |
| `yarn g:simple` | Simple service module | Small feature, simple CRUD |
| `yarn g:command` | Single command | Add new write operation |
| `yarn g:query` | Single query | Add new read operation |
| `yarn g:dto` | DTO files | Need new data structures |

---

**Happy Coding! 🚀**


