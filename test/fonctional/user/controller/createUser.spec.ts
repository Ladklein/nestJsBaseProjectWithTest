import { UserController } from '../../../../src/modules/user/infrastructure/controllers/user.controller';
import { CreateUserInput } from '../../../../src/modules/user/infrastructure/inputs/CreateUserInput';
import { Test } from '@nestjs/testing';
import { getEntities } from '../../../../src/modules/user/infrastructure/entities/typeorm';
import { getControllers } from '../../../../src/modules/user/infrastructure/controllers';
import { getUsecases } from '../../../../src/modules/user/application/usecases';
import { UserRepository } from '../../../../src/modules/user/application/repositories/user.repository';
import { UserMockRepository } from '../../../../src/modules/user/infrastructure/repositories/mock/userMock.repository';
import { User } from '../../../../src/modules/user/domain/user';
import { getMockRepositories } from '../../../../src/modules/user/infrastructure/repositories';
import { BadRequestException, HttpException } from '@nestjs/common';
import { err } from 'neverthrow';

describe('createUser - UserController', () => {
  let controller: UserController;
  let userMockRepository: UserMockRepository;
  const validePseudo = 'JohnDo01';
  const alreadyExistPseudo = 'JohnDo';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...getEntities()],
      controllers: [...getControllers()],
      providers: [...getMockRepositories(), ...getUsecases()],
    }).compile();

    userMockRepository = module.get<UserMockRepository>(UserRepository);
    controller = module.get<UserController>(UserController);

    userMockRepository.users = {
      userId: User.create({
        pseudo: alreadyExistPseudo,
      })._unsafeUnwrap(),
    };
  });

  describe('createUser', () => {
    it('should return a new user', async () => {
      const user: CreateUserInput = {
        pseudo: validePseudo,
      };
      const result = await controller.createUser(user);

      expect(result?.pseudo).toBe(user.pseudo);
      expect(result?.id).toBeTruthy();
    });

    const errorCases = [
      {
        case: 'Invalid pseudo input : so long',
        inputs: { pseudo: 'a'.repeat(100) },
        excepted: {
          error: BadRequestException,
        },
      },
      {
        case: 'Invalid pseudo input : so small',
        inputs: { pseudo: 'a'.repeat(2) },
        excepted: {
          error: BadRequestException,
        },
      },
      {
        case: 'Invalid pseudo input : not valid character',
        inputs: { pseudo: 'aaaazzzé' },
        excepted: {
          error: BadRequestException,
        },
      },
      {
        case: 'Invalid pseudo input : required',
        inputs: { pseudo: '' },
        excepted: {
          error: BadRequestException,
        },
      },
      {
        case: 'Cannot save user in db',
        inputs: { pseudo: validePseudo },
        excepted: {
          error: HttpException,
        },
      },
      {
        case: 'User already exist with pseudo in db',
        inputs: { pseudo: alreadyExistPseudo },
        excepted: {
          error: BadRequestException,
        },
      },
    ];
    it.each(errorCases)('Error case: $case', async ({ inputs, excepted }) => {
      if (excepted.error === HttpException) {
        jest
          .spyOn(userMockRepository, 'save')
          .mockImplementation(async (_user) => err('cannot save user'));
      }
      await expect(
        controller.createUser({
          pseudo: inputs.pseudo,
        }),
      ).rejects.toBeInstanceOf(excepted.error);
    });
  });
});
