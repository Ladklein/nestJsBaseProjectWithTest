import { RethrownError } from '../../../../../error-core/src';

export abstract class UseCaseError extends RethrownError {
  protected constructor(public readonly message: string, error?: Error) {
    super(message, error ?? new Error());
  }
}
