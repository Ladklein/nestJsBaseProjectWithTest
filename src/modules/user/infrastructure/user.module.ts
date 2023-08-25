import { Module } from '@nestjs/common';
import { getControllers } from './controllers';
import { getRepositories } from './repositories';
import { getEntities } from './entities/typeorm';
import { getUsecases } from '../application/usecases';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature(getEntities())],
  controllers: [...getControllers()],
  providers: [...getRepositories(), ...getUsecases()],
})
export class UserModule {}
