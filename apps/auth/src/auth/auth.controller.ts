import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { SignInDto } from './dtos/sign-in.dto';
import { SignedUserDto } from './dtos/signed-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDto): Promise<SignedUserDto> {
    return this.authService.signIn(signInDto);
  }
}
