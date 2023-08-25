import { Injectable, Logger } from '@nestjs/common';
import { err } from 'neverthrow';
import { CreateUserDto } from './createUser.dto';
import {
  CannotCheckForUserExistenceError,
  CannotSaveUserError,
  InvalidInputCreateUserError,
  UserAlreadyExistError,
} from './createUser.errors';
import { CreateUserResponse } from './createUser.response';
import { UseCase, UseCaseResult } from '@app/util-kernel';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class CreateUserUsecase
  implements UseCase<CreateUserDto, CreateUserResponse>
{
  private readonly logger = new Logger(CreateUserUsecase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    request: CreateUserDto,
  ): Promise<UseCaseResult<CreateUserResponse>> {
    const isExistUser = await this.userRepository.isExistByFields({
      pseudo: request.pseudo,
    });
    if (isExistUser.isErr()) {
      return err(
        new CannotCheckForUserExistenceError(request.pseudo, isExistUser.error),
      );
    }

    if (isExistUser.value) {
      return err(new UserAlreadyExistError(request.pseudo));
    }

    const userResult = User.create({
      pseudo: request.pseudo,
    });

    if (userResult.isErr()) {
      return err(new InvalidInputCreateUserError(request, userResult.error));
    }

    const result = await this.userRepository.save(userResult.value);
    return result
      .map((user) => ({ user: user }))
      .mapErr((error) => new CannotSaveUserError(error));
  }
}
