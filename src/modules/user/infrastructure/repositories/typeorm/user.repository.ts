import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { err, ok, Result } from 'neverthrow';
import { Repository } from 'typeorm';
import { RethrownError } from '@app/error-core';
import { UserEntity } from '../../entities/typeorm/user.entity';
import { UserMapper } from '../../mappers/userMapper';
import { UserRepository } from '../../../application/repositories/user.repository';
import { User } from '../../../domain/user';

@Injectable()
export class UserTypeOrmRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async getById(userId: string): Promise<Result<User, any>> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!userEntity) {
        return err(`user with id ${userId} is not found`);
      }

      return UserMapper.fromTypeOrm(userEntity);
    } catch (error) {
      return err(new RethrownError('error while getting user with id', error));
    }
  }

  async isExistByFields(fields: {
    pseudo?: string;
  }): Promise<Result<boolean, any>> {
    try {
      const qb = await this.userRepository.createQueryBuilder('user');

      if (fields.pseudo) {
        qb.andWhere('LOWER(user.pseudo) = LOWER(:pseudo)', {
          pseudo: fields.pseudo,
        });
      }

      const isExist = await qb.getExists();

      return ok(isExist);
    } catch (error) {
      return err(
        new RethrownError('error while getting user with fields', error),
      );
    }
  }

  async save(user: User): Promise<Result<User, any>> {
    try {
      const userEntity = await this.userRepository.save(
        UserMapper.toTypeOrm(user),
      );
      return UserMapper.fromTypeOrm(userEntity);
    } catch (error) {
      return err(new RethrownError('error while saving user', error));
    }
  }

  async deleteById(userId: string): Promise<Result<boolean, any>> {
    try {
      const userEntity = await this.userRepository.delete(userId);

      if (userEntity.affected) {
        return ok(true);
      }

      return ok(false);
    } catch (error) {
      return err(new RethrownError('error while deleting user', error));
    }
  }
}
