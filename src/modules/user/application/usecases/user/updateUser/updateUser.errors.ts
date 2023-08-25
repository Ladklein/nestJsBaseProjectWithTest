import { UseCaseError } from '@app/util-kernel';
import { UpdateUserDto } from './updateUser.dto';

export class InvalidUserError extends UseCaseError {
  constructor(user: UpdateUserDto, error: any) {
    super(`Invalid input user ${JSON.stringify(user)}`, error);
  }
}
export class CannotFindUserError extends UseCaseError {
  constructor(userId: string, error: any) {
    super(`Cannot find user with id ${userId}`, error);
  }
}

export class CannotUpdateUserError extends UseCaseError {
  constructor(request: UpdateUserDto, error: any) {
    super(`Cannot update user with fields ${JSON.stringify(request)}`, error);
  }
}
