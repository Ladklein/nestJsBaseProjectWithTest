import { UseCaseError } from '@app/util-kernel';
import { CreateUserDto } from './createUser.dto';

export class InvalidInputCreateUserError extends UseCaseError {
  constructor(input: Partial<CreateUserDto>, error: any) {
    super(`Invalid input ${JSON.stringify(input)}`, error);
  }
}

export class CannotCheckForUserExistenceError extends UseCaseError {
  constructor(pseudo: string, error: any) {
    super(`Cannot check for user existence with pseudo ${pseudo}`, error);
  }
}

export class UserAlreadyExistError extends UseCaseError {
  constructor(pseudo: string) {
    super(`User already exist with pseudo ${pseudo}`);
  }
}

export class CannotSaveUserError extends UseCaseError {
  constructor(error: any) {
    super(`Cannot save name`, error);
  }
}
