import { UserDto } from 'shared/dtos/user.dto';

export class CreatedUserEvent {
  constructor(user: UserDto) {
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
