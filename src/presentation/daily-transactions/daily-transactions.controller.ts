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
  CreateDailyTransactionDto,
  UpdateDailyTransactionDto,
  GetDailyTransactionsQueryDto,
  DailyTransactionResponseDto,
} from '@shared/dtos/daily-transactions';
import {
  CreateDailyTransactionCommand,
  UpdateDailyTransactionCommand,
} from '@application/commands/daily-transactions';
import { DeleteDailyTransactionCommand } from '@application/commands/daily-transactions/delete-daily-transaction/delete-daily-transaction.command';
import {
  GetDailyTransactionByIdQuery,
  GetDailyTransactionsQuery,
  GetDailyTransactionsResponseDto,
} from '@application/queries/daily-transactions';

@ApiTags('dailyTransactions')
@Controller('plans/:planId/items/:planItemId/dailyTransactions')
@UseInterceptors(ClassSerializerInterceptor)
export class DailyTransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new daily transaction' })
  @ApiResponse({
    status: 201,
    description: 'Daily transaction created successfully',
    type: DailyTransactionResponseDto,
  })
  async create(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Body() createDto: CreateDailyTransactionDto,
  ) {
    return this.commandBus.execute(
      new CreateDailyTransactionCommand(planId, planItemId, createDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all daily transactions with filters' })
  @ApiResponse({
    status: 200,
    description: 'Daily transactions retrieved successfully',
  })
  async findAll(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Query() queryDto: GetDailyTransactionsQueryDto,
  ) {
    return this.queryBus.execute<
      GetDailyTransactionsQuery,
      GetDailyTransactionsResponseDto
    >(new GetDailyTransactionsQuery(planId, planItemId, queryDto));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get daily transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Daily transaction retrieved successfully',
    type: DailyTransactionResponseDto,
  })
  async findOne(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
  ) {
    return this.queryBus.execute<
      GetDailyTransactionByIdQuery,
      DailyTransactionResponseDto
    >(new GetDailyTransactionByIdQuery(planId, planItemId, id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update daily transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Daily transaction updated successfully',
    type: DailyTransactionResponseDto,
  })
  async update(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateDailyTransactionDto,
  ) {
    return this.commandBus.execute(
      new UpdateDailyTransactionCommand(planId, planItemId, id, updateDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete daily transaction by ID' })
  @ApiResponse({
    status: 204,
    description: 'Daily transaction deleted successfully',
  })
  async remove(
    @Param('planId') planId: string,
    @Param('planItemId') planItemId: string,
    @Param('id') id: string,
  ) {
    return this.commandBus.execute(
      new DeleteDailyTransactionCommand(planId, planItemId, id),
    );
  }
}
