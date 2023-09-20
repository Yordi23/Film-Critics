import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilmMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  profilePicture: string;
}
