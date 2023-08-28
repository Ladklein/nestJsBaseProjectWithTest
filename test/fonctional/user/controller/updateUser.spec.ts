import { UserController } from '../../../../src/modules/user/infrastructure/controllers/user.controller';
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
import { UpdateFieldsUserInput } from '../../../../src/modules/user/infrastructure/inputs/UpdateFieldsUserInput';
import { Uuid } from '@app/util-kernel';

describe('updateUser - UserController', () => {
  let controller: UserController;
  let userMockRepository: UserMockRepository;
  const userId = '7705de3a-4692-4652-beb2-7e142771ba67';
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
      [userId]: User.create(
        {
          pseudo: alreadyExistPseudo,
        },
        new Uuid(userId),
      )._unsafeUnwrap(),
    };
  });

  it('should return a new user', async () => {
    const user: UpdateFieldsUserInput = {
      pseudo: validePseudo,
    };
    const result = await controller.updateUser(userId, user);

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
  ];
  it.each(errorCases)('Error case: $case', async ({ inputs, excepted }) => {
    if (excepted.error === HttpException) {
      jest
        .spyOn(userMockRepository, 'save')
        .mockImplementation(async (_user) => err('cannot save user'));
    }
    await expect(
      controller.updateUser(userId, {
        pseudo: inputs.pseudo,
      }),
    ).rejects.toBeInstanceOf(excepted.error);
  });
});
