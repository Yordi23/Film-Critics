import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './film.entity';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dtos/create-film.dto';
import { UpdateFilmDto } from './dtos/update-film.dto';
import { FilmMemberService } from '../film-member/film-member.service';
import { FilmMember } from '../film-member/film-member.entity';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    private filmMemberService: FilmMemberService,
  ) {}

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const director = await this.filmMemberService.findOneById(
      createFilmDto.director,
    );

    const cast = await this.filmMemberService.findByIds(createFilmDto.cast);

    const newFilm = this.filmRepository.create({
      ...createFilmDto,
      director,
      cast,
    });

    return this.filmRepository.save(newFilm);
  }

  findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      relations: {
        cast: true,
        director: true,
        reviews: true,
      },
    });
  }

  async findOneById(id: number): Promise<Film> {
    const filmMember = await this.filmRepository.findOne({
      where: { id },
      relations: {
        cast: true,
        director: true,
      },
    });

    if (!filmMember) {
      throw new NotFoundException('Film not found');
    }

    return filmMember;
  }

  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const existingFilm = await this.findOneById(id);

    let newDirector: FilmMember = undefined,
      newCast: FilmMember[] = undefined;

    if (updateFilmDto.director) {
      newDirector = await this.filmMemberService.findOneById(
        updateFilmDto.director,
      );
    }

    if (updateFilmDto.cast) {
      newCast = await this.filmMemberService.findByIds(updateFilmDto.cast);
    }

    const castToDict = updateFilmDto.cast.reduce(
      (acc, curr) => ((acc[curr] = true), acc),
      {},
    );

    existingFilm.cast = existingFilm.cast.filter((filmCast) => {
      return castToDict[filmCast.id];
    });

    this.filmRepository.merge(existingFilm, {
      ...updateFilmDto,
      director: newDirector,
      cast: newCast,
    });

    return this.filmRepository.save(existingFilm);
  }

  async delete(id: number): Promise<void> {
    await this.filmRepository.delete(id);
  }
}
