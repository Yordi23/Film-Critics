import { UserDto } from 'shared/dtos/user.dto';

export class UpdatedUserEvent {
  constructor(user: UserDto) {
    this.id = user.id;
    this.name = user.name;
    this.profilePicture = user.profilePicture;
  }

  readonly id: number;
  readonly name?: string;
  readonly profilePicture?: string;
}
