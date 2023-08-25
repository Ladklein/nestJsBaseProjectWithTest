import { INestApplication } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEntities } from '../../src/modules/user/infrastructure/entities/typeorm';
import { join } from 'path';
import { UserModule } from '../../src/modules/user/infrastructure/user.module';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import {
  Builder,
  fixturesIterator,
  IEntity,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli';
import * as path from 'path';
import { User } from '../../src/modules/user/domain/user';
import { UserEntity } from '../../src/modules/user/infrastructure/entities/typeorm/user.entity';

let app: INestApplication | undefined;
let queryRunner: QueryRunner;
let dataSource: DataSource;
beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'user_test',
        username: 'user_test',
        password: 'password_test',
        entities: [...getEntities()],
        migrations: [join(__dirname, '../../../migrations/*.{ts,js}')],
        migrationsTableName: 'typeorm_migrations',
        synchronize: true,
        migrationsRun: true,
      }),
      UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  app = moduleFixture.createNestApplication();

  const manager = await app?.resolve<EntityManager>(EntityManager);
  dataSource = await app?.resolve<DataSource>(DataSource);

  /**
   * This is a hack to allow sharing transaction manager between tests and app
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  queryRunner = manager.queryRunner = dataSource.createQueryRunner('master');

  await app.init();
});

afterAll(async () => {
  await getTestApp().close();
});

beforeEach(() => {
  queryRunner.startTransaction();

  return async () => {
    queryRunner.rollbackTransaction();
  };
});

export const getDatabaseConnection = (): DataSource => {
  if (!dataSource) {
    throw new Error('Test DB is not setup');
  }

  return dataSource;
};

export const getTestApp = (): INestApplication => {
  if (!app) {
    throw new Error('Test App is not setup');
  }

  return app;
};
