import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './enums/user-roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserRoles.USER })
  role: string;

  @Column()
  profilePicture: string;
}
