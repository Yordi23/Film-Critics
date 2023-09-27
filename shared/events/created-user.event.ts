import { User } from 'apps/auth/src/user/user.entity';

export class CreatedUserEvent {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.profilePicture = user.profilePicture;
  }

  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly profilePicture: string;
}
