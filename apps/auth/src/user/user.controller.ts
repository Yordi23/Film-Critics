import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtPayloadDto } from '../auth/dtos/jwt-payload.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthorizedRoles } from '../auth/decorators/authorized-roles.decorator';
import { UserRoles } from './enums/user-roles.enum';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  updateSelf(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayloadDto,
  ): Promise<User> {
    return this.userService.update(user.id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @AuthorizedRoles(UserRoles.ADMIN)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
