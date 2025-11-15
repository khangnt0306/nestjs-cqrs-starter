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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  GetCategorysQueryDto,
  CategoryResponseDto,
} from '@shared/dtos/categorys';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
} from '@application/commands/categorys';
import {
  GetCategoryByIdQuery,
  GetCategorysQuery,
  GetCategorysResponseDto,
} from '@application/queries/categorys';

@ApiTags('categorys')
@Controller('categorys')
@UseInterceptors(ClassSerializerInterceptor)
export class CategorysController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.commandBus.execute(
      new CreateCategoryCommand(createCategoryDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categorys with filters' })
  @ApiResponse({
    status: 200,
    description: 'Categorys retrieved successfully',
  })
  async findAll(@Query() queryDto: GetCategorysQueryDto) {
    return this.queryBus.execute<GetCategorysQuery, GetCategorysResponseDto>(
      new GetCategorysQuery(queryDto),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, updateCategoryDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteCategoryCommand(id));
  }
}

