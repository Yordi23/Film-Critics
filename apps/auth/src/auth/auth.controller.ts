import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller()
export class AuthController {
  constructor(
    // @Inject('AUTH_SERVICE') private client: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // this.client.emit<number>('user_created', { data: 'This is test payload' });

    return this.authService.registerUser(createUserDto);
  }
}
