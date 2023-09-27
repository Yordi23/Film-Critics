import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EventNames } from 'shared/enums/event-names.enum';
import { CreatedUserEvent } from 'shared/events/created-user.event';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern(EventNames.CREATED_USER)
  async handleUserCreated(event: CreatedUserEvent) {
    this.emailService.sendWelcomeEmail({
      email: event.email,
      name: event.name,
      profilePicture: event.profilePicture,
    });
  }
}
