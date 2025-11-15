const path = require('path');

module.exports = function (plop) {
  // Helper để convert PascalCase
  plop.setHelper('pascalCase', (text) => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
      .replace(/[\s-_]+/g, '');
  });

  // Helper để convert camelCase
  plop.setHelper('camelCase', (text) => {
    const pascal = text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
      .replace(/[\s-_]+/g, '');
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  });

  // Helper để convert kebab-case
  plop.setHelper('kebabCase', (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  });

  // Helper để convert lowercase
  plop.setHelper('lowercase', (text) => {
    return text.toLowerCase();
  });

  // Generator chính: Tạo CRUD hoàn chỉnh
  plop.setGenerator('feature', {
    description:
      'Generate a complete CQRS feature (Entity, DTOs, Repository, Commands, Queries, Controller, Module)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (singular, e.g., Film, Product):',
        validate: (value) => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Feature name is required';
        },
      },
      {
        type: 'input',
        name: 'pluralName',
        message: 'Plural name (e.g., Films, Products):',
        default: (answers) => answers.name + 's',
      },
      {
        type: 'confirm',
        name: 'withAuth',
        message: 'Add JWT authentication to endpoints?',
        default: true,
      },
    ],
    actions: function (data) {
      const actions = [];

      // 1. Entity
      actions.push({
        type: 'add',
        path: 'src/domain/entities/{{kebabCase name}}.entity.ts',
        templateFile: 'plop-templates/entity.hbs',
      });

      // 2. DTOs
      actions.push({
        type: 'add',
        path: 'src/shared/dtos/{{kebabCase pluralName}}/create-{{kebabCase name}}.dto.ts',
        templateFile: 'plop-templates/dto-create.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/shared/dtos/{{kebabCase pluralName}}/update-{{kebabCase name}}.dto.ts',
        templateFile: 'plop-templates/dto-update.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/shared/dtos/{{kebabCase pluralName}}/get-{{kebabCase pluralName}}.dto.ts',
        templateFile: 'plop-templates/dto-get-all.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/shared/dtos/{{kebabCase pluralName}}/{{kebabCase name}}-response.dto.ts',
        templateFile: 'plop-templates/dto-response.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/shared/dtos/{{kebabCase pluralName}}/index.ts',
        templateFile: 'plop-templates/dto-index.hbs',
      });

      // 3. Repository
      actions.push({
        type: 'add',
        path: 'src/infrastructure/repositories/{{kebabCase name}}.repository.ts',
        templateFile: 'plop-templates/repository.hbs',
      });

      // 4. Commands
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/create-{{kebabCase name}}/create-{{kebabCase name}}.command.ts',
        templateFile: 'plop-templates/command-create.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/create-{{kebabCase name}}/create-{{kebabCase name}}.handler.ts',
        templateFile: 'plop-templates/command-create-handler.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/create-{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/command-index.hbs',
        data: { commandType: 'create' },
      });

      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/update-{{kebabCase name}}/update-{{kebabCase name}}.command.ts',
        templateFile: 'plop-templates/command-update.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/update-{{kebabCase name}}/update-{{kebabCase name}}.handler.ts',
        templateFile: 'plop-templates/command-update-handler.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/update-{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/command-index.hbs',
        data: { commandType: 'update' },
      });

      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/delete-{{kebabCase name}}/delete-{{kebabCase name}}.command.ts',
        templateFile: 'plop-templates/command-delete.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/delete-{{kebabCase name}}/delete-{{kebabCase name}}.handler.ts',
        templateFile: 'plop-templates/command-delete-handler.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/delete-{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/command-index.hbs',
        data: { commandType: 'delete' },
      });

      actions.push({
        type: 'add',
        path: 'src/application/commands/{{kebabCase pluralName}}/index.ts',
        templateFile: 'plop-templates/commands-index.hbs',
      });

      // 5. Queries
      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase name}}-by-id/get-{{kebabCase name}}-by-id.query.ts',
        templateFile: 'plop-templates/query-by-id.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase name}}-by-id/get-{{kebabCase name}}-by-id.handler.ts',
        templateFile: 'plop-templates/query-by-id-handler.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase name}}-by-id/index.ts',
        templateFile: 'plop-templates/query-index.hbs',
        data: { queryType: 'by-id' },
      });

      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase pluralName}}/get-{{kebabCase pluralName}}.query.ts',
        templateFile: 'plop-templates/query-all.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase pluralName}}/get-{{kebabCase pluralName}}.handler.ts',
        templateFile: 'plop-templates/query-all-handler.hbs',
      });
      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/get-{{kebabCase pluralName}}/index.ts',
        templateFile: 'plop-templates/query-index.hbs',
        data: { queryType: 'all' },
      });

      actions.push({
        type: 'add',
        path: 'src/application/queries/{{kebabCase pluralName}}/index.ts',
        templateFile: 'plop-templates/queries-index.hbs',
      });

      // 6. Controller
      actions.push({
        type: 'add',
        path: 'src/presentation/{{kebabCase pluralName}}/{{kebabCase pluralName}}.controller.ts',
        templateFile: 'plop-templates/controller.hbs',
      });

      // 7. Module
      actions.push({
        type: 'add',
        path: 'src/presentation/{{kebabCase pluralName}}/{{kebabCase pluralName}}.module.ts',
        templateFile: 'plop-templates/module.hbs',
      });

      // Success message
      actions.push({
        type: 'addMany',
        destination: '.',
        base: 'plop-templates/',
        templateFiles: [],
      });

      return actions;
    },
  });

  // Generator đơn giản: Chỉ tạo Command
  plop.setGenerator('command', {
    description: 'Generate a single command (command + handler)',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (plural, e.g., users, films):',
      },
      {
        type: 'input',
        name: 'commandName',
        message: 'Command name (e.g., archive-user, publish-film):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/application/commands/{{kebabCase feature}}/{{kebabCase commandName}}/{{kebabCase commandName}}.command.ts',
        templateFile: 'plop-templates/command-custom.hbs',
      },
      {
        type: 'add',
        path: 'src/application/commands/{{kebabCase feature}}/{{kebabCase commandName}}/{{kebabCase commandName}}.handler.ts',
        templateFile: 'plop-templates/command-custom-handler.hbs',
      },
      {
        type: 'add',
        path: 'src/application/commands/{{kebabCase feature}}/{{kebabCase commandName}}/index.ts',
        templateFile: 'plop-templates/command-custom-index.hbs',
      },
    ],
  });

  // Generator đơn giản: Chỉ tạo Query
  plop.setGenerator('query', {
    description: 'Generate a single query (query + handler)',
    prompts: [
      {
        type: 'input',
        name: 'feature',
        message: 'Feature name (plural, e.g., users, films):',
      },
      {
        type: 'input',
        name: 'queryName',
        message: 'Query name (e.g., get-active-users, get-top-films):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/application/queries/{{kebabCase feature}}/{{kebabCase queryName}}/{{kebabCase queryName}}.query.ts',
        templateFile: 'plop-templates/query-custom.hbs',
      },
      {
        type: 'add',
        path: 'src/application/queries/{{kebabCase feature}}/{{kebabCase queryName}}/{{kebabCase queryName}}.handler.ts',
        templateFile: 'plop-templates/query-custom-handler.hbs',
      },
      {
        type: 'add',
        path: 'src/application/queries/{{kebabCase feature}}/{{kebabCase queryName}}/index.ts',
        templateFile: 'plop-templates/query-custom-index.hbs',
      },
    ],
  });
};
