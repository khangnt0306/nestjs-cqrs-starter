import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreatePlanDto,
  UpdatePlanDto,
  GetPlansQueryDto,
  PlanResponseDto,
  UpdatePlanStatusDto,
} from '@shared/dtos/plans';
import {
  CreatePlanCommand,
  UpdatePlanCommand,
  DeletePlanCommand,
  UpdatePlanStatusCommand,
} from '@application/commands/plans';
import {
  GetPlanByIdQuery,
  GetPlansQuery,
  GetPlansResponseDto,
} from '@application/queries/plans';
import { GetPlansSelfQuery } from '@application/queries/plans/get-plans-self/get-plans.query';
import { GetPlansSelfResponseDto } from '@application/queries/plans/get-plans-self/get-plans.handler';

@ApiTags('plans')
@Controller('plans')
@UseInterceptors(ClassSerializerInterceptor)
export class PlansController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  async create(@Body() createPlanDto: CreatePlanDto, @Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return this.commandBus.execute(
      new CreatePlanCommand(createPlanDto, userId),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all plans with filters' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
  })
  async findAll(@Query() queryDto: GetPlansQueryDto) {
    return this.queryBus.execute<GetPlansQuery, GetPlansResponseDto>(
      new GetPlansQuery(queryDto),
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
  async findAllSelf(@Query() queryDto: GetPlansQueryDto, @Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return this.queryBus.execute<GetPlansSelfQuery, GetPlansSelfResponseDto>(
      new GetPlansSelfQuery(queryDto, userId),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan retrieved successfully',
    type: PlanResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetPlanByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanResponseDto,
  })
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.commandBus.execute(new UpdatePlanCommand(id, updatePlanDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete plan by ID' })
  @ApiResponse({
    status: 204,
    description: 'Plan deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeletePlanCommand(id));
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update plan status' })
  @ApiResponse({
    status: 200,
    description: 'Plan status updated successfully',
    type: PlanResponseDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updatePlanStatusDto: UpdatePlanStatusDto,
  ) {
    return this.commandBus.execute(
      new UpdatePlanStatusCommand(id, updatePlanStatusDto.status),
    );
  }
}
