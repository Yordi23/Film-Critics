import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern } from '@nestjs/microservices';
import { CreatedUserEvent } from 'apps/shared/events/created-user.event';
import { UpdatedUserEvent } from 'apps/shared/events/updated-user.event';
import { DeletedUserEvent } from 'apps/shared/events/deleted-user.event';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('created_user')
  async handleUserCreated(event: CreatedUserEvent) {
    this.userService.create(event);
  }

  @EventPattern('updated_user')
  async handleUserUpdated(event: UpdatedUserEvent) {
    this.userService.update(event);
  }

  @EventPattern('deleted_user')
  async handleUserDeleted(event: DeletedUserEvent) {
    this.userService.delete(event.id);
  }
}
