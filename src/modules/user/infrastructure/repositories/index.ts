import { UserRepository } from '../../application/repositories/user.repository';
import { UserTypeOrmRepository } from './typeorm/user.repository';
import { UserMockRepository } from './mock/userMock.repository';

export const getRepositories = () => [
  {
    provide: UserRepository,
    useClass: UserTypeOrmRepository,
  },
];

export const getMockRepositories = () => [
  {
    provide: UserRepository,
    useClass: UserMockRepository,
  },
];
