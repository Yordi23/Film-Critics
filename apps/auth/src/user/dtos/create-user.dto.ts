export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  role?: string;
}
