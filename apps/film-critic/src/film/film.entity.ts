import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { FilmMember } from '../film-member/film-member.entity';
import { Review } from '../review/review.entity';

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

  @ManyToOne(() => FilmMember)
  director: FilmMember;

  @ManyToMany(() => FilmMember)
  @JoinTable()
  cast: FilmMember[];

  @Column()
  picture: string;

  @OneToMany(() => Review, (review) => review.film)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: null })
  deletedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
