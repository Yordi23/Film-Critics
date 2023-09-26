import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern } from '@nestjs/microservices';
import { CreatedUserEvent } from 'apps/shared/events/created-user.event';
import { UpdatedUserEvent } from 'apps/shared/events/updated-user.event';
import { DeletedUserEvent } from 'apps/shared/events/deleted-user.event';
import { EventNames } from 'apps/shared/enums/event-names.enum';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventNames.CREATED_USER)
  async handleUserCreated(event: CreatedUserEvent) {
    this.userService.create(event);
  }

  @EventPattern(EventNames.UPDATED_USER)
  async handleUserUpdated(event: UpdatedUserEvent) {
    this.userService.update(event);
  }

  @EventPattern(EventNames.DELETED_USER)
  async handleUserDeleted(event: DeletedUserEvent) {
    this.userService.delete(event.id);
  }
}
