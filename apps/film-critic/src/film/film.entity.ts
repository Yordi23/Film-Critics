import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { FilmMember } from '../film-member/film-member.entity';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  plot: string;

  @Column()
  year: number;

  @ManyToOne(() => FilmMember, (filmMember) => filmMember.id)
  director: FilmMember;

  @ManyToMany(() => FilmMember, (filmMember) => filmMember.id)
  @JoinTable()
  cast: FilmMember[];

  @Column()
  picture: string;
}
