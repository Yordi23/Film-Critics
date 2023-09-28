import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { UserRoles } from 'shared/enums/user-roles.enum';

@Injectable()
export class AdminUserDatabaseSeeder implements OnApplicationBootstrap {
  constructor(private readonly userService: UserService) {}

  async onApplicationBootstrap() {
    const existingAdmin =
      await this.userService.findOneByEmail('admin@email.com');

    if (existingAdmin) return null;

    const createUserDto: CreateUserDto = {
      name: 'Admin User',
      email: 'admin@email.com',
      password: 'admin1234',
      role: UserRoles.ADMIN,
      profilePicture:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png',
    };
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);

    return this.userService.create(createUserDto);
  }
}
