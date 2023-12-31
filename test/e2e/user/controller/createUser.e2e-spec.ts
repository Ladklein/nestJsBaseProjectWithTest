import * as request from 'supertest';
import { UserEntity } from '../../../../src/modules/user/infrastructure/entities/typeorm/user.entity';
import { getDatabaseConnection, getTestApp } from '../../bootstrap.e2e-spec';
import { resolve } from 'path';
import { loadFixtures } from '../../fixture.e2e-spec';
import { UserErrors } from '@app/error-core';
import { UserRoutes } from '@app/util-routes';

describe('createUser - userController (e2e)', () => {
  it(`${UserRoutes.CreateUser} (POST): should return success`, async () => {
    const validPseudo = 'test5';
    const response = await request(getTestApp().getHttpServer())
      .post(UserRoutes.CreateUser)
      .send({
        pseudo: validPseudo,
      })
      .expect(201);

    expect(response.body.pseudo).toBe(validPseudo);
    expect(response.body.id).not.toBeNull();

    const user = await getDatabaseConnection()
      .getRepository(UserEntity)
      .findOne({ where: { id: response.body.id } });

    expect(user?.pseudo).toBe(validPseudo);
    expect(user?.id).toBe(response.body.id);
  });

  it(`${UserRoutes.CreateUser} (POST): bad response with pseudo already exist`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/createUser.yml'));
    const validPseudo = 'Test12';
    const response = await request(getTestApp().getHttpServer())
      .post(UserRoutes.CreateUser)
      .send({
        pseudo: validPseudo,
      })
      .expect(400);

    expect(JSON.parse(response.text).error).toBe(
      `User already exist with pseudo ${validPseudo}`,
    );
    expect(JSON.parse(response.text).statusCode).toBe(400);
    expect(JSON.parse(response.text).message).toBe(
      UserErrors.InvalidInputUserError,
    );
  });

  it(`${UserRoutes.CreateUser} (POST): bad response with invalid pseudo input : so long`, async () => {
    await loadFixtures(resolve(__dirname, 'fixtures/createUser.yml'));
    const validPseudo = 'a'.repeat(100);
    const input = {
      pseudo: validPseudo,
    };
    const response = await request(getTestApp().getHttpServer())
      .post(UserRoutes.CreateUser)
      .send(input)
      .expect(400);

    expect(JSON.parse(response.text).error).toBe(
      `Invalid input ${JSON.stringify(input)}`,
    );
    expect(JSON.parse(response.text).statusCode).toBe(400);
    expect(JSON.parse(response.text).message).toBe(
      UserErrors.InvalidInputUserError,
    );
  });
});
