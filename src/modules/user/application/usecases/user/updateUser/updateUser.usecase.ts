import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './updateUser.dto';
import {
  CannotFindUserError,
  CannotUpdateUserError,
  InvalidUserError,
} from './updateUser.errors';
import { UpdateUserResponse } from './updateUser.response';
import { UseCase, UseCaseResult } from '@app/util-kernel';
import { err } from 'neverthrow';
import { UserRepository } from '../../../repositories/user.repository';
import { User } from '../../../../domain/user';

@Injectable()
export class UpdateUserUsecase
  implements UseCase<UpdateUserDto, UpdateUserResponse>
{
  private readonly logger = new Logger(UpdateUserUsecase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    request: UpdateUserDto,
  ): Promise<UseCaseResult<UpdateUserResponse>> {
    const userResult = await this.userRepository.getById(request.userId);
    if (userResult.isErr()) {
      return err(new CannotFindUserError(request.userId, userResult.error));
    }

    const user = userResult.value;
    if (request.pseudo !== undefined) {
      const isValidPseudo = User.isValidPseudo(request.pseudo);
      if (isValidPseudo.isErr()) {
        return err(new InvalidUserError(request, isValidPseudo.error));
      }

      user.pseudo = request.pseudo;
    }

    const result = await this.userRepository.save(user);
    return result
      .map((user) => ({
        user,
      }))
      .mapErr((error) => new CannotUpdateUserError(request, error));
  }
}
