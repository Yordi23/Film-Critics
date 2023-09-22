import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreatedUserEvent } from 'apps/auth/src/user/events/created-user.event';
import { UpdatedUserEvent } from 'apps/auth/src/user/events/updated-user.event';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createdUserEvent: CreatedUserEvent): Promise<User> {
    const newUser = this.usersRepository.create(createdUserEvent);

    return this.usersRepository.save(newUser);
  }

  async update(updatedUserEvent: UpdatedUserEvent): Promise<User> {
    return this.usersRepository.save(updatedUserEvent);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
