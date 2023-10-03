import { Test } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { faker } from '@faker-js/faker';
import { UserRoles } from 'shared/enums/user-roles.enum';
import { JwtService } from '@nestjs/jwt';
import { MockType } from 'shared/testing/mock.type';
import { generateFakeUser } from 'shared/testing/fake/user.fake';
import { SignInDto } from './dtos/sign-in.dto';
import { UnauthorizedException } from '@nestjs/common';
import { generateFakeCreateUserDto } from '../user/testing/create-user.dto.fake';

// Cannot use const because, of the way the mocks are initialized, it will not recognize this variable
// eslint-disable-next-line prefer-const
let reverseString = (s) => s.split('').reverse().join('');

jest.mock('bcryptjs', () => ({
  hash: jest
    .fn()
    .mockImplementation((password: string) =>
      Promise.resolve(reverseString(password)),
    ),
  compare: (inputPassword, storedPassword) =>
    reverseString(inputPassword) === storedPassword,
}));

describe('AuthService', () => {
  let authService: AuthService;

  const fakeUser = generateFakeUser();

  const userService: MockType<UserService> = {
    create: jest.fn().mockResolvedValue(fakeUser),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findOneByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const jwtService: MockType<JwtService> = {
    signAsync: jest
      .fn()
      .mockImplementation((payload) =>
        Promise.resolve(JSON.stringify(payload)),
      ),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    const createUserDto = generateFakeCreateUserDto();

    it('should call the create method of the UserService', async () => {
      const expectedResult: CreateUserDto = {
        ...createUserDto,
        role: UserRoles.USER,
        password: reverseString(createUserDto.password),
      };

      await authService.signUp(createUserDto);

      expect(userService.create).toBeCalledWith(expectedResult);
    });

    it('should return the newly created user', async () => {
      const result = await authService.signUp(createUserDto);

      expect(result).toEqual(fakeUser);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    userService.findOneByEmail.mockImplementation(() =>
      Promise.resolve({
        ...fakeUser,
        password: reverseString(signInDto.password),
      }),
    );

    it('should call the findOneByEmail method of the UserService', async () => {
      await authService.signIn(signInDto);

      expect(userService.findOneByEmail).toBeCalledWith(signInDto.email);
    });

    it('should return the signed user and the jwt', async () => {
      const expectedJwt = JSON.stringify({
        email: fakeUser.email,
        id: fakeUser.id,
        role: fakeUser.role,
      });
      const expectedUser = {
        ...fakeUser,
        password: reverseString(signInDto.password),
      };

      const result = await authService.signIn(signInDto);

      expect(result).toEqual({ user: expectedUser, jwt: expectedJwt });
    });

    it('should throw an UnauthorizedException if the provided password does not match the user password', async () => {
      const promise = authService.signIn({
        email: signInDto.email,
        password: 'wrongpassword',
      });

      expect(promise).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });

    it('should call the signAsync method of the JwtService', async () => {
      const expectedPayload = {
        email: fakeUser.email,
        id: fakeUser.id,
        role: fakeUser.role,
      };

      await authService.signIn(signInDto);

      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
