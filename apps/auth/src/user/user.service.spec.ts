import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatedUserEvent } from 'shared/events/created-user.event';
import { UpdatedUserEvent } from 'shared/events/updated-user.event';
import { DeletedUserEvent } from 'shared/events/deleted-user.event';
import { EventNames } from 'shared/enums/event-names.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MockType } from 'shared/testing/mock.type';
import { faker } from '@faker-js/faker';
import { generateFakeUser } from 'shared/testing/fake/user.fake';

describe('UserService', () => {
  let userService: UserService;

  const client: MockType<ClientProxy> = {
    emit: jest.fn(),
  };

  const users = [generateFakeUser(), generateFakeUser(), generateFakeUser()];
  const user = generateFakeUser();
  const userRepository: MockType<Repository<User>> = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: user.id })),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    find: jest.fn().mockResolvedValue(users),
    findOneBy: jest.fn().mockImplementation((filter) => {
      if (filter.id && filter.id !== user.id) return null;
      if (filter.email && filter.email !== user.email) return null;

      return user;
    }),
    merge: jest.fn().mockImplementation((originalObj, objToMerge) => {
      originalObj.profilePicture = objToMerge.profilePicture;
    }),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: client,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: user.name,
      email: user.email,
      password: faker.internet.password(),
      profilePicture: user.profilePicture,
      role: user.role,
    };

    it('should call the create method of the UserRepository', async () => {
      await userService.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should call the save method of the UserRepository', async () => {
      await userService.create(createUserDto);

      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        id: user.id,
      });
    });

    it('should call the emit method of the ClientProxy', async () => {
      await userService.create(createUserDto);

      expect(client.emit).toHaveBeenCalledWith(
        EventNames.CREATED_USER,
        new CreatedUserEvent({ ...createUserDto, id: user.id }),
      );
    });

    it('should return the newly created user', async () => {
      const user = await userService.create(createUserDto);

      expect(user).toEqual({
        ...createUserDto,
        id: user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the UserRepository', async () => {
      await userService.findAll();

      expect(userRepository.find).toHaveBeenCalledWith();
    });

    it('should return a list of users', async () => {
      const result = await userService.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOneById', () => {
    it('should call the findOneBy method of the UserRepository', async () => {
      await userService.findOneById(user.id);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: user.id });
    });

    it('should return an user', async () => {
      const result = await userService.findOneById(user.id);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user with the given ID is not found', async () => {
      const userId = 999;

      const promise = userService.findOneById(userId);

      await expect(promise).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should call the findOneBy method of the UserRepository', async () => {
      await userService.findOneByEmail(user.email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: user.email,
      });
    });

    it('should return an user', async () => {
      const result = await userService.findOneByEmail(user.email);

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      profilePicture: faker.internet.url(),
    };

    it('should call the findOneBy method of the UserRepository', async () => {
      await userService.update(user.id, updateUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: user.id });
    });

    it('should call the save method of the UserRepository', async () => {
      await userService.update(user.id, updateUserDto);

      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
      });
    });

    it('should call the emit method of the ClientProxy', async () => {
      await userService.update(user.id, updateUserDto);

      expect(client.emit).toHaveBeenCalledWith(
        EventNames.UPDATED_USER,
        new UpdatedUserEvent(user),
      );
    });
  });

  describe('delete', () => {
    it('should call the softDelete method of the UserRepository', async () => {
      await userService.delete(user.id);

      expect(userRepository.softDelete).toHaveBeenCalledWith(user.id);
    });

    it('should call the emit method of the ClientProxy', async () => {
      await userService.delete(user.id);

      expect(client.emit).toHaveBeenCalledWith(
        EventNames.DELETED_USER,
        new DeletedUserEvent(user.id),
      );
    });
  });
});
