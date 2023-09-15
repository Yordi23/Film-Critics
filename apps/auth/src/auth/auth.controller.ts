import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Get()
  createUser(): string {
    this.client.emit<number>('user_created', { data: 'This is test payload' });

    return 'Done';
  }
}
