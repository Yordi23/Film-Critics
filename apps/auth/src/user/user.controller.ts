import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from 'apps/shared/guards/auth.guard';
import { CurrentUser } from 'apps/shared/decorators/current-user.decorator';
import { RolesGuard } from 'apps/shared/guards/roles.guard';
import { AuthorizedRoles } from 'apps/shared/decorators/authorized-roles.decorator';
import { UserRoles } from 'apps/shared/enums/user-roles.enum';
import { JwtPayloadDto } from 'apps/shared/dtos/jwt-payload.dto';

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
