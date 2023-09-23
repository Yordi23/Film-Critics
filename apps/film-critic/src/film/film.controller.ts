import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Film } from '../film/film.entity';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dtos/create-film.dto';
import { UpdateFilmDto } from './dtos/update-film.dto';
import { AuthGuard } from 'apps/auth/src/auth/guards/auth.guard';
import { RolesGuard } from 'apps/auth/src/auth/guards/roles.guard';
import { AuthorizedRoles } from 'apps/auth/src/auth/decorators/authorized-roles.decorator';
import { UserRoles } from 'apps/auth/src/user/enums/user-roles.enum';

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

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Post()
  create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmService.create(createFilmDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmService.update(id, updateFilmDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.filmService.delete(id);
  }
}
