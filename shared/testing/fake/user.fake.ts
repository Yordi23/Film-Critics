import { UserDto } from 'shared/dtos/user.dto';
import { faker } from '@faker-js/faker';
import { UserRoles } from 'shared/enums/user-roles.enum';

export const generateFakeUser = (): UserDto & { role: UserRoles } => {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    profilePicture: faker.internet.url(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(Object.values(UserRoles)),
  };
};
