import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmMember } from './film-member.entity';
import { In, Repository } from 'typeorm';
import { CreateFilmMemberDto } from './dtos/create-film-member.dto';
import { UpdateFilmMemberDto } from './dtos/update-film-member.dto';

@Injectable()
export class FilmMemberService {
  constructor(
    @InjectRepository(FilmMember)
    private filmMembersRepository: Repository<FilmMember>,
  ) {}

  create(createFilmMemberDto: CreateFilmMemberDto): Promise<FilmMember> {
    const newFilmMember =
      this.filmMembersRepository.create(createFilmMemberDto);

    return this.filmMembersRepository.save(newFilmMember);
  }

  findAll(): Promise<FilmMember[]> {
    return this.filmMembersRepository.find();
  }

  async findOneById(id: number): Promise<FilmMember> {
    const filmMember = await this.filmMembersRepository.findOneBy({ id });

    if (!filmMember) {
      throw new NotFoundException('Film Member not found');
    }

    return filmMember;
  }

  async findByIds(ids: number[]): Promise<FilmMember[]> {
    const filmMembers = await this.filmMembersRepository.findBy({
      id: In(ids),
    });

    if (filmMembers.length !== ids.length) {
      throw new NotFoundException('One or more film members not found');
    }

    return filmMembers;
  }

  async update(
    id: number,
    updateFilmMemberDto: UpdateFilmMemberDto,
  ): Promise<FilmMember> {
    const existingMember = await this.findOneById(id);

    this.filmMembersRepository.merge(existingMember, updateFilmMemberDto);

    return this.filmMembersRepository.save(existingMember);
  }

  async delete(id: number): Promise<void> {
    await this.filmMembersRepository.softDelete(id);
  }
}
