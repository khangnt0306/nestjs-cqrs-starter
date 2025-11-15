module.exports = function (plop) {
  // Helpers
  plop.setHelper('lowerCase', (text) => text.toLowerCase());

  // ============================================
  // GENERATOR 1: CQRS Module (Full Stack)
  // ============================================
  plop.setGenerator('cqrs-module', {
    description: '🚀 Generate a complete CQRS module with all layers',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (singular, e.g., "Film", "Product"):',
        validate: (value) => {
          if (!value) return 'Name is required';
          return true;
        },
      },
    ],
    actions: (data) => {
      const basePath = 'src';
      const name = data.name;

      return [
        // 1. Entity
        {
          type: 'add',
          path: `${basePath}/domain/entities/{{kebabCase name}}.entity.ts`,
          templateFile: 'plop-templates/cqrs-module/entity.hbs',
        },
        // 2. Repository
        {
          type: 'add',
          path: `${basePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
          templateFile: 'plop-templates/cqrs-module/repository.hbs',
        },
        // 3. DTOs
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/create-{{kebabCase name}}.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-create.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/update-{{kebabCase name}}.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-update.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/get-{{kebabCase name}}s.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-get.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/{{kebabCase name}}-response.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-response.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/index.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-index.hbs',
        },
        // 4. Commands
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/create-{{kebabCase name}}/create-{{kebabCase name}}.command.ts`,
          templateFile: 'plop-templates/cqrs-module/command-create.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/create-{{kebabCase name}}/create-{{kebabCase name}}.handler.ts`,
          templateFile: 'plop-templates/cqrs-module/command-create-handler.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/create-{{kebabCase name}}/index.ts`,
          templateFile: 'plop-templates/cqrs-module/command-create-index.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/update-{{kebabCase name}}/update-{{kebabCase name}}.command.ts`,
          templateFile: 'plop-templates/cqrs-module/command-update.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/update-{{kebabCase name}}/update-{{kebabCase name}}.handler.ts`,
          templateFile: 'plop-templates/cqrs-module/command-update-handler.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/update-{{kebabCase name}}/index.ts`,
          templateFile: 'plop-templates/cqrs-module/command-update-index.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/delete-{{kebabCase name}}/delete-{{kebabCase name}}.command.ts`,
          templateFile: 'plop-templates/cqrs-module/command-delete.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/delete-{{kebabCase name}}/delete-{{kebabCase name}}.handler.ts`,
          templateFile: 'plop-templates/cqrs-module/command-delete-handler.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/delete-{{kebabCase name}}/index.ts`,
          templateFile: 'plop-templates/cqrs-module/command-delete-index.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/commands/{{camelCase name}}s/index.ts`,
          templateFile: 'plop-templates/cqrs-module/commands-index.hbs',
        },
        // 5. Queries
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}-by-id/get-{{kebabCase name}}-by-id.query.ts`,
          templateFile: 'plop-templates/cqrs-module/query-get-by-id.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}-by-id/get-{{kebabCase name}}-by-id.handler.ts`,
          templateFile:
            'plop-templates/cqrs-module/query-get-by-id-handler.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}-by-id/index.ts`,
          templateFile: 'plop-templates/cqrs-module/query-get-by-id-index.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}s/get-{{kebabCase name}}s.query.ts`,
          templateFile: 'plop-templates/cqrs-module/query-get-list.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}s/get-{{kebabCase name}}s.handler.ts`,
          templateFile: 'plop-templates/cqrs-module/query-get-list-handler.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/get-{{kebabCase name}}s/index.ts`,
          templateFile: 'plop-templates/cqrs-module/query-get-list-index.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/application/queries/{{camelCase name}}s/index.ts`,
          templateFile: 'plop-templates/cqrs-module/queries-index.hbs',
        },
        // 6. Controller
        {
          type: 'add',
          path: `${basePath}/presentation/{{kebabCase name}}s/{{kebabCase name}}s.controller.ts`,
          templateFile: 'plop-templates/cqrs-module/controller.hbs',
        },
        // 7. Module
        {
          type: 'add',
          path: `${basePath}/presentation/{{kebabCase name}}s/{{kebabCase name}}s.module.ts`,
          templateFile: 'plop-templates/cqrs-module/module.hbs',
        },
        // Success message
        {
          type: 'add',
          path: 'plop-success.txt',
          template: `
✅ CQRS Module "{{pascalCase name}}" created successfully!

📁 Generated files:
   - Entity: src/domain/entities/{{kebabCase name}}.entity.ts
   - Repository: src/infrastructure/repositories/{{kebabCase name}}.repository.ts
   - DTOs: src/shared/dtos/{{camelCase name}}s/
   - Commands: src/application/commands/{{camelCase name}}s/
   - Queries: src/application/queries/{{camelCase name}}s/
   - Controller: src/presentation/{{kebabCase name}}s/{{kebabCase name}}s.controller.ts
   - Module: src/presentation/{{kebabCase name}}s/{{kebabCase name}}s.module.ts

📝 Next steps:
   1. Update entity fields in: src/domain/entities/{{kebabCase name}}.entity.ts
   2. Update DTOs to match entity fields
   3. Update repository filters if needed
   4. Register module in app.module.ts:
      import { {{pascalCase name}}sModule } from './presentation/{{kebabCase name}}s/{{kebabCase name}}s.module';
      
      @Module({
        imports: [
          // ... other imports
          {{pascalCase name}}sModule,
        ],
      })
   5. Run migration: yarn typeorm migration:generate -n Create{{pascalCase name}}
   6. Run migration: yarn typeorm migration:run
`,
          skipIfExists: false,
        },
        () => {
          console.log('\n🎉 CQRS Module generated successfully!\n');
          return 'Module created';
        },
      ];
    },
  });

  // ============================================
  // GENERATOR 2: Simple Module (Service-based)
  // ============================================
  plop.setGenerator('simple-module', {
    description: '📦 Generate a simple service-based module (no CQRS)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (singular, e.g., "Film", "Product"):',
        validate: (value) => {
          if (!value) return 'Name is required';
          return true;
        },
      },
    ],
    actions: (data) => {
      const basePath = 'src';

      return [
        // 1. Entity (reuse from CQRS)
        {
          type: 'add',
          path: `${basePath}/domain/entities/{{kebabCase name}}.entity.ts`,
          templateFile: 'plop-templates/cqrs-module/entity.hbs',
        },
        // 2. Repository (reuse from CQRS)
        {
          type: 'add',
          path: `${basePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
          templateFile: 'plop-templates/cqrs-module/repository.hbs',
        },
        // 3. DTOs (reuse from CQRS)
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/create-{{kebabCase name}}.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-create.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/update-{{kebabCase name}}.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-update.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/get-{{kebabCase name}}s.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-get.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/{{kebabCase name}}-response.dto.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-response.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/shared/dtos/{{camelCase name}}s/index.ts`,
          templateFile: 'plop-templates/cqrs-module/dto-index.hbs',
        },
        // 4. Service
        {
          type: 'add',
          path: `${basePath}/presentation/{{kebabCase name}}s/{{kebabCase name}}s.service.ts`,
          templateFile: 'plop-templates/simple-module/service.hbs',
        },
        // 5. Controller
        {
          type: 'add',
          path: `${basePath}/presentation/{{kebabCase name}}s/{{kebabCase name}}s.controller.ts`,
          templateFile: 'plop-templates/simple-module/controller.hbs',
        },
        // 6. Module
        {
          type: 'add',
          path: `${basePath}/presentation/{{kebabCase name}}s/{{kebabCase name}}s.module.ts`,
          templateFile: 'plop-templates/simple-module/module.hbs',
        },
        {
          type: 'add',
          path: 'plop-success.txt',
          template: `
✅ Simple Module "{{pascalCase name}}" created successfully!

📁 Generated files:
   - Entity: src/domain/entities/{{kebabCase name}}.entity.ts
   - Repository: src/infrastructure/repositories/{{kebabCase name}}.repository.ts
   - DTOs: src/shared/dtos/{{camelCase name}}s/
   - Service: src/presentation/{{kebabCase name}}s/{{kebabCase name}}s.service.ts
   - Controller: src/presentation/{{kebabCase name}}s/{{kebabCase name}}s.controller.ts
   - Module: src/presentation/{{kebabCase name}}s/{{kebabCase name}}s.module.ts

📝 Next steps:
   1. Update entity fields in: src/domain/entities/{{kebabCase name}}.entity.ts
   2. Update DTOs to match entity fields
   3. Register module in app.module.ts
`,
          skipIfExists: false,
        },
        () => {
          console.log('\n🎉 Simple Module generated successfully!\n');
          return 'Module created';
        },
      ];
    },
  });

  // ============================================
  // GENERATOR 3: Single Command
  // ============================================
  plop.setGenerator('command', {
    description: '⚡ Generate a single command with handler',
    prompts: [
      {
        type: 'input',
        name: 'module',
        message: 'Module name (e.g., "users", "films"):',
        validate: (value) => {
          if (!value) return 'Module name is required';
          return true;
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'Command name (e.g., "SendEmail", "ProcessPayment"):',
        validate: (value) => {
          if (!value) return 'Command name is required';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/application/commands/{{camelCase module}}/{{kebabCase name}}/{{kebabCase name}}.command.ts',
        templateFile: 'plop-templates/command/command.hbs',
      },
      {
        type: 'add',
        path: 'src/application/commands/{{camelCase module}}/{{kebabCase name}}/{{kebabCase name}}.handler.ts',
        templateFile: 'plop-templates/command/handler.hbs',
      },
      {
        type: 'add',
        path: 'src/application/commands/{{camelCase module}}/{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/command/index.hbs',
      },
      () => {
        console.log('\n✅ Command generated successfully!');
        console.log(
          "📝 Don't forget to register the handler in your module providers!\n",
        );
        return 'Command created';
      },
    ],
  });

  // ============================================
  // GENERATOR 4: Single Query
  // ============================================
  plop.setGenerator('query', {
    description: '🔍 Generate a single query with handler',
    prompts: [
      {
        type: 'input',
        name: 'module',
        message: 'Module name (e.g., "users", "films"):',
        validate: (value) => {
          if (!value) return 'Module name is required';
          return true;
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'Query name (e.g., "GetUserStats", "GetFilmReviews"):',
        validate: (value) => {
          if (!value) return 'Query name is required';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/application/queries/{{camelCase module}}/{{kebabCase name}}/{{kebabCase name}}.query.ts',
        templateFile: 'plop-templates/query/query.hbs',
      },
      {
        type: 'add',
        path: 'src/application/queries/{{camelCase module}}/{{kebabCase name}}/{{kebabCase name}}.handler.ts',
        templateFile: 'plop-templates/query/handler.hbs',
      },
      {
        type: 'add',
        path: 'src/application/queries/{{camelCase module}}/{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/query/index.hbs',
      },
      () => {
        console.log('\n✅ Query generated successfully!');
        console.log(
          "📝 Don't forget to register the handler in your module providers!\n",
        );
        return 'Query created';
      },
    ],
  });

  // ============================================
  // GENERATOR 5: DTOs
  // ============================================
  plop.setGenerator('dto', {
    description: '📋 Generate DTO files (Create, Update, Response)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'DTO name (e.g., "User", "Film"):',
        validate: (value) => {
          if (!value) return 'Name is required';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/shared/dtos/{{camelCase name}}s/create-{{kebabCase name}}.dto.ts',
        templateFile: 'plop-templates/dto/create.hbs',
      },
      {
        type: 'add',
        path: 'src/shared/dtos/{{camelCase name}}s/update-{{kebabCase name}}.dto.ts',
        templateFile: 'plop-templates/dto/update.hbs',
      },
      {
        type: 'add',
        path: 'src/shared/dtos/{{camelCase name}}s/{{kebabCase name}}-response.dto.ts',
        templateFile: 'plop-templates/dto/response.hbs',
      },
      () => {
        console.log('\n✅ DTOs generated successfully!\n');
        return 'DTOs created';
      },
    ],
  });
};
