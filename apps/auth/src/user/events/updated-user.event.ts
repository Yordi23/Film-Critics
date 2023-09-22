import { User } from '../user.entity';

export class UpdatedUserEvent {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.profilePicture = user.profilePicture;
  }

  readonly id: number;
  readonly name?: string;
  readonly profilePicture?: string;
}
