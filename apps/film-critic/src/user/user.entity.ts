import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Review } from '../review/review.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  profilePicture: string;

  @ManyToMany(() => Review)
  @JoinTable()
  likedReviews: Review[];

  @ManyToMany(() => Review)
  @JoinTable()
  dislikedReviews: Review[];
}
