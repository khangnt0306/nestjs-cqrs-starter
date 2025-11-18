import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateDefaultTransactionDto,
  UpdateDefaultTransactionDto,
  GetDefaultTransactionsQueryDto,
  DefaultTransactionResponseDto,
} from '@shared/dtos/default-transactions';
import {
  CreateDefaultTransactionCommand,
  UpdateDefaultTransactionCommand,
} from '@application/commands/default-transactions';
import { DeleteDefaultTransactionCommand } from '@application/commands/default-transactions/delete-default-transaction/delete-default-transaction.command';
import {
  GetDefaultTransactionByIdQuery,
  GetDefaultTransactionsQuery,
  GetDefaultTransactionsResponseDto,
} from '@application/queries/default-transactions';

@ApiTags('defaultTransactions')
@Controller('plans/:planId/items/:planItemId/defaultTransactions')
@UseInterceptors(ClassSerializerInterceptor)
export class DefaultTransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new default transaction' })
  @ApiResponse({
    status: 201,
    description: 'Default transaction created successfully',
    type: DefaultTransactionResponseDto,
  })
  async create(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Body() createDto: CreateDefaultTransactionDto,
  ) {
    return this.commandBus.execute(
      new CreateDefaultTransactionCommand(planId, planItemId, createDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all default transactions with filters' })
  @ApiResponse({
    status: 200,
    description: 'Default transactions retrieved successfully',
  })
  async findAll(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Query() queryDto: GetDefaultTransactionsQueryDto,
  ) {
    return this.queryBus.execute<
      GetDefaultTransactionsQuery,
      GetDefaultTransactionsResponseDto
    >(new GetDefaultTransactionsQuery(planId, planItemId, queryDto));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get default transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Default transaction retrieved successfully',
    type: DefaultTransactionResponseDto,
  })
  async findOne(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
  ) {
    return this.queryBus.execute<
      GetDefaultTransactionByIdQuery,
      DefaultTransactionResponseDto
    >(new GetDefaultTransactionByIdQuery(planId, planItemId, id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update default transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Default transaction updated successfully',
    type: DefaultTransactionResponseDto,
  })
  async update(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateDefaultTransactionDto,
  ) {
    return this.commandBus.execute(
      new UpdateDefaultTransactionCommand(planId, planItemId, id, updateDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete default transaction by ID' })
  @ApiResponse({
    status: 204,
    description: 'Default transaction deleted successfully',
  })
  async remove(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
  ) {
    return this.commandBus.execute(
      new DeleteDefaultTransactionCommand(planId, planItemId, id),
    );
  }
}
