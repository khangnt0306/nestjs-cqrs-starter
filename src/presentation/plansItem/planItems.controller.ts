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
  Request,
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
  CreatePlanItemDto,
  UpdatePlanItemDto,
  GetPlanItemsQueryDto,
  PlanItemResponseDto,
} from '@shared/dtos/plansItem';
import {
  CreatePlanItemCommand,
  UpdatePlanItemCommand,
} from '@application/commands/planItems';
import { DeletePlanItemCommand } from '@application/commands/planItems/delete-plan-item/delete-plan-item.command';
import {
  GetPlanItemByIdQuery,
  GetPlanItemCommand,
  GetPlanItemResponseDto,
} from '@application/queries/plans-item';
import {
  GetPlanItemsSelfQuery,
  GetPlanItemsSelfResponseDto,
} from '@application/queries/plans-item/get-plan-item-self';

@ApiTags('planItems')
@Controller('plans/:planId/items')
@UseInterceptors(ClassSerializerInterceptor)
export class PlanItemsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new plan item' })
  @ApiResponse({
    status: 201,
    description: 'Plan item created successfully',
    type: PlanItemResponseDto,
  })
  async create(
    @Param('planId') planId: string,
    @Body() createPlanItemDto: CreatePlanItemDto,
  ) {
    return this.commandBus.execute(
      new CreatePlanItemCommand(planId, createPlanItemDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all plan items with filters' })
  @ApiResponse({
    status: 200,
    description: 'Plan items retrieved successfully',
  })
  async findAll(
    @Param('planId') planId: string,
    @Query() queryDto: GetPlanItemsQueryDto,
  ) {
    return this.queryBus.execute<GetPlanItemCommand, GetPlanItemResponseDto>(
      new GetPlanItemCommand(planId, queryDto),
    );
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all plans for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
  })
  async findAllSelf(
    @Param('planId') planId: string,
    @Query() queryDto: GetPlanItemsQueryDto,
    @Request() req: Request,
  ) {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.queryBus.execute<
      GetPlanItemsSelfQuery,
      GetPlanItemsSelfResponseDto
    >(new GetPlanItemsSelfQuery(planId, queryDto, userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plan item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan item retrieved successfully',
    type: PlanItemResponseDto,
  })
  async findOne(@Param('planId') planId: string, @Param('id') id: string) {
    return this.queryBus.execute<GetPlanItemByIdQuery, PlanItemResponseDto>(
      new GetPlanItemByIdQuery(planId, id),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanItemResponseDto,
  })
  async update(
    @Param('planId') planId: string,
    @Param('id') id: string,
    @Body() updatePlanItemDto: UpdatePlanItemDto,
  ) {
    return this.commandBus.execute(
      new UpdatePlanItemCommand(planId, id, updatePlanItemDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete plan by ID' })
  @ApiResponse({
    status: 204,
    description: 'Plan item deleted successfully',
  })
  async remove(@Param('planId') planId: string, @Param('id') id: string) {
    return this.commandBus.execute(new DeletePlanItemCommand(planId, id));
  }
}
