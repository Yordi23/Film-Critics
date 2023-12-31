import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'shared/decorators/current-user.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AuthorizedRoles } from 'shared/decorators/authorized-roles.decorator';
import { UserRoles } from 'shared/enums/user-roles.enum';
import { JwtPayloadDto } from 'shared/dtos/jwt-payload.dto';
import { AuthGuard } from 'shared/guards/auth.guard';

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
