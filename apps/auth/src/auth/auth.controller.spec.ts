import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MockType } from 'shared/testing/mock.type';
import { generateFakeUser } from 'shared/testing/fake/user.fake';
import { generateFakeCreateUserDto } from '../user/testing/create-user.dto.fake';
import { SignInDto } from './dtos/sign-in.dto';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let authController: AuthController;

  const fakeUser = generateFakeUser();
  const fakeJwt = faker.string.uuid();

  const authService: MockType<AuthService> = {
    signUp: jest.fn().mockResolvedValue(fakeUser),
    signIn: jest.fn().mockResolvedValue({
      user: fakeUser,
      jwt: fakeJwt,
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    const createUserDto = generateFakeCreateUserDto();

    it('should call the signUp method of the AuthService', async () => {
      await authController.signUp(createUserDto);

      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the newly created user', async () => {
      const result = await authController.signUp(createUserDto);

      expect(result).toEqual(fakeUser);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it('should call the signIn method of the AuthService', async () => {
      await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should return the jwt and the signed in user', async () => {
      const result = await authController.signIn(signInDto);

      expect(result).toEqual({
        user: fakeUser,
        jwt: fakeJwt,
      });
    });
  });
});
