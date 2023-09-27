import { UserDto } from 'shared/dtos/user.dto';

export class SignedUserDto {
  user: UserDto;
  jwt: string;
}
