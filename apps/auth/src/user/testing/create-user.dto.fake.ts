import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRoles } from 'shared/enums/user-roles.enum';

export const generateFakeCreateUserDto = (): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profilePicture: faker.internet.url(),
    role: faker.helpers.arrayElement(Object.values(UserRoles)),
  };
};
