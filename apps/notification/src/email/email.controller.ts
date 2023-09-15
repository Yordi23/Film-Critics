import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('email')
export class EmailController {
  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    console.log('MESSAGE RECEIVED', data);
  }
}
