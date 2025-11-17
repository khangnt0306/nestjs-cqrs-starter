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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  GetCategoriesQueryDto,
} from '@shared/dtos/categories';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
} from '@application/commands/categories';
import {
  GetCategoryByIdQuery,
  GetCategoriesQuery,
  GetCategoriesResponseDto,
} from '@application/queries/categories';
import { GetCategoriesSelfQuery } from '@application/queries/categories/get-categories-self/get-categories.query';
import { GetCategoriesSelfResponseDto } from '@application/queries/categories/get-categories-self/get-categories.handler';

@ApiTags('categories')
@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
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
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: Request,
  ) {
    const userId = (req as any).user.id;
    return this.commandBus.execute(
      new CreateCategoryCommand(createCategoryDto, userId),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories with filters' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async findAll(@Query() queryDto: GetCategoriesQueryDto) {
    return this.queryBus.execute<GetCategoriesQuery, GetCategoriesResponseDto>(
      new GetCategoriesQuery(queryDto),
    );
  }
  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async findAllSelf(
    @Query() queryDto: GetCategoriesQueryDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return this.queryBus.execute<
      GetCategoriesSelfQuery,
      GetCategoriesSelfResponseDto
    >(new GetCategoriesSelfQuery(queryDto, userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get categoryy by ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoryy retrieved successfully',
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
