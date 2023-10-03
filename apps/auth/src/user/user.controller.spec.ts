import { Test } from '@nestjs/testing';
import { MockType } from 'shared/testing/mock.type';
import { generateFakeUser } from 'shared/testing/fake/user.fake';
import { faker } from '@faker-js/faker';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtPayloadDto } from 'shared/dtos/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let userController: UserController;

  const fakeUser = generateFakeUser();
  const fakeUsers = [
    generateFakeUser(),
    generateFakeUser(),
    generateFakeUser(),
  ];
  const jwtPayload: JwtPayloadDto = {
    id: fakeUser.id,
    email: fakeUser.email,
    role: fakeUser.role,
  };

  const userService: MockType<UserService> = {
    update: jest.fn().mockResolvedValue(fakeUser),
    findAll: jest.fn().mockResolvedValue(fakeUsers),
  };

  const jwtService: MockType<JwtService> = {
    verifyAsync: jest.fn().mockResolvedValue(jwtPayload),
  };

  const configService: MockType<ConfigService> = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  describe('updateSelf', () => {
    const updateUserDto: UpdateUserDto = {
      profilePicture: faker.internet.url(),
    };

    it('should call the update method of the UserService', async () => {
      await userController.updateSelf(updateUserDto, jwtPayload);

      expect(userService.update).toHaveBeenCalledWith(
        jwtPayload.id,
        updateUserDto,
      );
    });

    it('should return the updated user', async () => {
      const result = await userController.updateSelf(updateUserDto, jwtPayload);

      expect(result).toEqual(fakeUser);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the UserService', async () => {
      await userController.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
    });

    it('should return an array of users', async () => {
      const result = await userController.findAll();

      expect(result).toEqual(fakeUsers);
    });
  });
});
