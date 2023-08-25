import { Result } from 'neverthrow';
import { User } from '../../domain/user';
export abstract class UserRepository {
  abstract isExistByFields(fields: {
    pseudo?: string;
  }): Promise<Result<boolean, any>>;
  abstract getById(userId: string): Promise<Result<User, any>>;
  abstract save(user: User): Promise<Result<User, any>>;
  abstract deleteById(userId: string): Promise<Result<boolean, any>>;
}
