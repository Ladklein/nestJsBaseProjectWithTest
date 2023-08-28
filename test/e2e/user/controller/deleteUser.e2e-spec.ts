import * as request from 'supertest';
import { UserEntity } from '../../../../src/modules/user/infrastructure/entities/typeorm/user.entity';
import { getDatabaseConnection, getTestApp } from '../../bootstrap.e2e-spec';
import { resolve } from 'path';
import { loadFixtures } from '../../fixture.e2e-spec';
import { UserErrors } from '@app/error-core';
import { UserRoutes } from '@app/util-routes';

describe('deleteUser - userController (e2e)', () => {
  const validUserId = '7705de3a-4692-4652-beb2-7e142771ba67';
  const routeForDeleteUser = UserRoutes.DeleteUser.replace(':id', validUserId);

  it(`${UserRoutes.DeleteUser} (DELETE): should return success`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/deleteUser.yml'));

    const response = await request(getTestApp().getHttpServer())
      .delete(routeForDeleteUser)
      .send()
      .expect(200);

    expect(response.body.deleted).toBeTruthy();

    const user = await getDatabaseConnection()
      .getRepository(UserEntity)
      .findOne({ where: { id: validUserId } });

    expect(user).toBeNull();
  });

  it(`${UserRoutes.DeleteUser} (DELETE): error user not exist`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/updateUser.yml'));
    const userIdNotExist = 'test';
    const response = await request(getTestApp().getHttpServer())
      .delete(UserRoutes.DeleteUser.replace(':id', userIdNotExist))
      .send()
      .expect(404);

    expect(JSON.parse(response.text).error).toBe(
      `Cannot find user with id ${userIdNotExist}`,
    );
    expect(JSON.parse(response.text).statusCode).toBe(404);
    expect(JSON.parse(response.text).message).toBe(
      UserErrors.CannotFindUserError,
    );
  });
});
