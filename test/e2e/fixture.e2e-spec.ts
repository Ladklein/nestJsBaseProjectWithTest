import {
  Builder,
  fixturesIterator,
  IEntity,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { getDatabaseConnection } from './bootstrap.e2e-spec';

export const loadFixtures = async (fixturesPath: string) => {
  const connection = await getDatabaseConnection();
  const loader = new Loader();
  loader.load(path.resolve(fixturesPath));

  const updateEntity = (connection: DataSource, entity: IEntity): IEntity => {
    if (connection.hasMetadata(entity.constructor.name)) {
      const metadata = connection.getMetadata(entity.constructor.name);
      metadata.ownColumns.forEach((ownColumn) => {
        switch (ownColumn.type) {
          case Date:
          case 'datetime':
          case 'datetime2':
          case 'smalldatetime':
          case 'time with time zone':
          case 'time without time zone':
          case 'time':
          case 'timestamp with local time zone':
          case 'timestamp with time zone':
          case 'timestamp without time zone':
          case 'timestamp':
          case 'timestamptz':
          case 'timetz': {
            const value = entity[ownColumn.propertyPath];
            if (value && !(value instanceof Date)) {
              entity[ownColumn.propertyPath] = new Date(value);
            }
            break;
          }
          default:
            // nothing to do
            break;
        }
      });
    }

    return entity;
  };

  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(connection, new Parser(), true);
  for (const fixture of fixturesIterator(fixtures)) {
    const entity = updateEntity(connection, await builder.build(fixture));
    await connection.getRepository(entity.constructor.name).save(entity);
  }

  return connection;
};
