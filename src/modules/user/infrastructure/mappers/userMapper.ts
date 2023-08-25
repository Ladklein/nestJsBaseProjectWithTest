import { Result } from 'neverthrow';
import { User } from '../../domain/user';
import { Uuid } from '@app/util-kernel';
import { UserEntity } from '../entities/typeorm/user.entity';
import { UserModel } from '../models/userModel';

export class UserMapper {
  static fromTypeOrm(source: UserEntity): Result<User, any> {
    return User.create(
      {
        pseudo: source.pseudo,
      },
      new Uuid(source.id),
    );
  }

  static toTypeOrm(source: User): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = source.id.value;
    userEntity.pseudo = source.pseudo;
    return userEntity;
  }

  static toModel(source: User): UserModel {
    const userModel = new UserModel();
    userModel.id = source.id.value;
    userModel.pseudo = source.pseudo;
    return userModel;
  }
}
