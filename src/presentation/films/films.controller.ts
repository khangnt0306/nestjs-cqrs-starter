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
  CreateFilmDto,
  UpdateFilmDto,
  GetFilmsQueryDto,
  FilmResponseDto,
} from '@shared/dtos/films';
import {
  CreateFilmCommand,
  UpdateFilmCommand,
  DeleteFilmCommand,
} from '@application/commands/films';
import {
  GetFilmByIdQuery,
  GetFilmsQuery,
  GetFilmsResponseDto,
} from '@application/queries/films';

@ApiTags('films')
@Controller('films')
@UseInterceptors(ClassSerializerInterceptor)
export class FilmsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new film' })
  @ApiResponse({
    status: 201,
    description: 'Film created successfully',
    type: FilmResponseDto,
  })
  async create(@Body() createFilmDto: CreateFilmDto) {
    return this.commandBus.execute(new CreateFilmCommand(createFilmDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all films with filters' })
  @ApiResponse({
    status: 200,
    description: 'Films retrieved successfully',
  })
  async findAll(@Query() queryDto: GetFilmsQueryDto) {
    return this.queryBus.execute<GetFilmsQuery, GetFilmsResponseDto>(
      new GetFilmsQuery(queryDto),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get film by ID' })
  @ApiResponse({
    status: 200,
    description: 'Film retrieved successfully',
    type: FilmResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetFilmByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update film by ID' })
  @ApiResponse({
    status: 200,
    description: 'Film updated successfully',
    type: FilmResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.commandBus.execute(new UpdateFilmCommand(id, updateFilmDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete film by ID' })
  @ApiResponse({
    status: 204,
    description: 'Film deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteFilmCommand(id));
  }
}
