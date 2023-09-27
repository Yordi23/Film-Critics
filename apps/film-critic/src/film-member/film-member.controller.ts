import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FilmMember } from '../film-member/film-member.entity';
import { FilmMemberService } from './film-member.service';
import { UpdateFilmMemberDto } from './dtos/update-film-member.dto';
import { CreateFilmMemberDto } from './dtos/create-film-member.dto';
import { AuthGuard } from 'shared/guards/auth.guard';
import { AuthorizedRoles } from 'shared/decorators/authorized-roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { UserRoles } from 'shared/enums/user-roles.enum';

@UseGuards(AuthGuard)
@Controller('film-members')
export class FilmMemberController {
  constructor(private readonly filmMemberService: FilmMemberService) {}

  @Get()
  findAll(): Promise<FilmMember[]> {
    return this.filmMemberService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<FilmMember> {
    return this.filmMemberService.findOneById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Post()
  create(
    @Body() createFilmMemberDto: CreateFilmMemberDto,
  ): Promise<FilmMember> {
    return this.filmMemberService.create(createFilmMemberDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFilmMemberDto: UpdateFilmMemberDto,
  ): Promise<FilmMember> {
    return this.filmMemberService.update(id, updateFilmMemberDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.filmMemberService.delete(id);
  }
}
