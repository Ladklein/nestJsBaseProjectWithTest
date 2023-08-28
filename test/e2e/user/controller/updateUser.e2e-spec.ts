import * as request from 'supertest';
import { UserEntity } from '../../../../src/modules/user/infrastructure/entities/typeorm/user.entity';
import { getDatabaseConnection, getTestApp } from '../../bootstrap.e2e-spec';
import { resolve } from 'path';
import { loadFixtures } from '../../fixture.e2e-spec';
import { UserErrors } from '@app/error-core';
import { UserRoutes } from '@app/util-routes';

describe('updateUser - userController (e2e)', () => {
  const validUserId = '7705de3a-4692-4652-beb2-7e142771ba67';
  const routeForUpdateUser = UserRoutes.UpdateUser.replace(':id', validUserId);

  it(`${UserRoutes.UpdateUser} (POST): should return success`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/updateUser.yml'));
    const validPseudo = 'test5';

    const response = await request(getTestApp().getHttpServer())
      .post(routeForUpdateUser)
      .send({
        pseudo: validPseudo,
      })
      .expect(200);

    expect(response.body.pseudo).toBe(validPseudo);
    expect(response.body.id).not.toBeNull();

    const user = await getDatabaseConnection()
      .getRepository(UserEntity)
      .findOne({ where: { id: response.body.id } });

    expect(user?.pseudo).toBe(validPseudo);
    expect(user?.id).toBe(response.body.id);
  });

  it(`${UserRoutes.UpdateUser} (POST): bad response with invalid pseudo input : so long`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/updateUser.yml'));
    const validPseudo = 'a'.repeat(100);
    const input = {
      pseudo: validPseudo,
    };
    const response = await request(getTestApp().getHttpServer())
      .post(routeForUpdateUser)
      .send(input)
      .expect(400);

    const inputError = {
      userId: validUserId,
      pseudo: validPseudo,
    };
    expect(JSON.parse(response.text).error).toBe(
      `Invalid input user ${JSON.stringify(inputError)}`,
    );
    expect(JSON.parse(response.text).statusCode).toBe(400);
    expect(JSON.parse(response.text).message).toBe(
      UserErrors.InvalidInputUserError,
    );
  });

  it(`${UserRoutes.UpdateUser} (POST): error user not exist`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/updateUser.yml'));
    const validPseudo = 'a'.repeat(100);
    const input = {
      pseudo: validPseudo,
    };
    const userIdNotExist = 'test';
    const response = await request(getTestApp().getHttpServer())
      .post(UserRoutes.UpdateUser.replace(':id', userIdNotExist))
      .send(input)
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
