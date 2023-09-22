import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreatedUserEvent } from './events/created-user.event';
import { UpdatedUserEvent } from './events/updated-user.event';
import { DeletedUserEvent } from './events/deleted-user.event';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('AUTH_SERVICE') private client: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    const savedUser = await this.usersRepository.save(newUser);
    this.client.emit('created_user', new CreatedUserEvent(savedUser));

    return savedUser;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOneById(id);

    this.usersRepository.merge(existingUser, updateUserDto);

    const updatedUser = await this.usersRepository.save(existingUser);

    this.client.emit('updated_user', new UpdatedUserEvent(updatedUser));

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);

    this.client.emit('deleted_user', new DeletedUserEvent(id));
  }
}
