import { UserDto } from '../../user/dtos/user.dto';

export class SignedUserDto {
  user: UserDto;
  jwt: string;
}
