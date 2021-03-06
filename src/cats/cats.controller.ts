import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { LoggingInterceptor } from 'src/core/intercepters/logging.interceptor';

@UseFilters(HttpExceptionFilter)
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body(ValidationPipe) createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    return { message: 'Cat created' };
  }
}
