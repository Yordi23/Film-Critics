import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Film } from '../film/film.entity';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dtos/create-film.dto';
import { UpdateFilmDto } from './dtos/update-film.dto';

@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  findAll(): Promise<Film[]> {
    return this.filmService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<Film> {
    return this.filmService.findOneById(id);
  }

  @Post()
  create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmService.create(createFilmDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmService.update(id, updateFilmDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.filmService.delete(id);
  }
}
