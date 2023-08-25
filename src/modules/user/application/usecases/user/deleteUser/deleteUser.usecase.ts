import { Injectable, Logger } from '@nestjs/common';
import { DeleteUserDto } from './deleteUser.dto';
import {
  CannotDeleteUserError,
  CannotFindUserError,
} from './deleteUser.errors';
import { DeleteUserResponse } from './deleteUser.response';
import { UseCase, UseCaseResult } from '@app/util-kernel';
import { err } from 'neverthrow';
import { UserRepository } from '../../../repositories/user.repository';

@Injectable()
export class DeleteUserUsecase
  implements UseCase<DeleteUserDto, DeleteUserResponse>
{
  private readonly logger = new Logger(DeleteUserUsecase.name);

  constructor(private readonly markerUserRepository: UserRepository) {}

  async execute(
    request: DeleteUserDto,
  ): Promise<UseCaseResult<DeleteUserResponse>> {
    const markerResult = await this.markerUserRepository.getById(
      request.userId,
    );
    if (markerResult.isErr()) {
      return err(new CannotFindUserError(request.userId, markerResult.error));
    }

    const result = await this.markerUserRepository.deleteById(request.userId);
    return result
      .map((deleted) => ({
        deleted,
      }))
      .mapErr((error) => new CannotDeleteUserError(request.userId, error));
  }
}
