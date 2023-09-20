import { UserRoles } from '../../user/enums/user-roles.enum';

export class JwtPayloadDto {
  id: number;
  email: string;
  role: UserRoles;
}
