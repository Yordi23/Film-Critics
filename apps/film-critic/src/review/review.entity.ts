import { Max, Min, validateOrReject } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Film } from '../film/film.entity';
import { User } from '../user/user.entity';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  @Min(1)
  @Max(5)
  rating: number;

  @ManyToOne(() => Film, (film) => film.reviews)
  film: Film;

  @ManyToMany(() => User)
  likes: Film;

  @ManyToMany(() => User)
  dislikes: Film;

  @BeforeInsert()
  @BeforeUpdate()
  private async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
