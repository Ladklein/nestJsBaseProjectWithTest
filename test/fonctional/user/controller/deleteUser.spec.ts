import { UserController } from '../../../../src/modules/user/infrastructure/controllers/user.controller';
import { Test } from '@nestjs/testing';
import { getEntities } from '../../../../src/modules/user/infrastructure/entities/typeorm';
import { getControllers } from '../../../../src/modules/user/infrastructure/controllers';
import { getUsecases } from '../../../../src/modules/user/application/usecases';
import { UserRepository } from '../../../../src/modules/user/application/repositories/user.repository';
import { UserMockRepository } from '../../../../src/modules/user/infrastructure/repositories/mock/userMock.repository';
import { User } from '../../../../src/modules/user/domain/user';
import { getMockRepositories } from '../../../../src/modules/user/infrastructure/repositories';
import { HttpException, NotFoundException } from '@nestjs/common';
import { err } from 'neverthrow';
import { Uuid } from '@app/util-kernel';

describe('deleteUser - UserController', () => {
  let controller: UserController;
  let userMockRepository: UserMockRepository;
  const userId = '7705de3a-4692-4652-beb2-7e142771ba67';
  const notExistUserId = '7705de3a-4692-4652-beb2-7e142771ba68';

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
          pseudo: 'JohnDo',
        },
        new Uuid(userId),
      )._unsafeUnwrap(),
    };
  });

  it('deleted user', async () => {
    const result = await controller.deleteUser(userId);

    expect(result?.deleted).toBeTruthy();
  });

  const errorCases = [
    {
      case: 'Invalid user id not exist',
      inputs: { userId: notExistUserId },
      excepted: {
        error: NotFoundException,
      },
    },
    {
      case: 'Cannot delete user in db',
      inputs: { userId },
      excepted: {
        error: HttpException,
      },
    },
  ];
  it.each(errorCases)('Error case: $case', async ({ inputs, excepted }) => {
    if (excepted.error === HttpException) {
      jest
        .spyOn(userMockRepository, 'deleteById')
        .mockImplementation(async (_user) => err('error while deleting user'));
    }
    await expect(controller.deleteUser(inputs.userId)).rejects.toBeInstanceOf(
      excepted.error,
    );
  });
});
