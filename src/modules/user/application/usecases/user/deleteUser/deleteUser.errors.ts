import { UseCaseError } from '@app/util-kernel';

export class CannotFindUserError extends UseCaseError {
  constructor(userId: string, error: any) {
    super(`Cannot find user with id ${userId}`, error);
  }
}

export class CannotDeleteUserError extends UseCaseError {
  constructor(userId: string, error: any) {
    super(`Cannot delete user with id ${userId}`, error);
  }
}
