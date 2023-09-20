import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayloadDto } from '../auth/dtos/jwt-payload.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put()
  updateSelf(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayloadDto,
  ): Promise<User> {
    updateUserDto.id = user.id;

    return this.userService.update(updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
