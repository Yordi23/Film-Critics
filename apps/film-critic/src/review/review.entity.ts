import { Max, Min, validateOrReject } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
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

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: null, select: false })
  deletedAt: Date;

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
