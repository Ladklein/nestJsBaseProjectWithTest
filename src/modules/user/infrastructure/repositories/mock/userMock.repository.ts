import { UserRepository } from '../../../application/repositories/user.repository';
import { err, ok, Result } from 'neverthrow';
import { User } from '../../../domain/user';

export class UserMockRepository extends UserRepository {
  public users: Record<string, User> = {};

  public constructor() {
    super();
  }

  async getById(userId: string): Promise<Result<User, any>> {
    const user = this.users[userId];
    if (!user) {
      return err(`user with id ${userId} is not found`);
    }

    return ok(user);
  }

  async isExistByFields(fields: {
    pseudo?: string;
  }): Promise<Result<boolean, any>> {
    const users = Object.values(this.users).filter((user) => {
      if (fields.pseudo?.toLowerCase() !== user.pseudo.toLowerCase()) {
        return false;
      }

      return true;
    });

    return ok(!!users.length);
  }

  async getByFields(fields: { pseudo?: string }): Promise<Result<User, any>> {
    const user = Object.values(this.users).filter((user) => {
      if (fields.pseudo?.toLowerCase() !== user.pseudo.toLowerCase()) {
        return false;
      }

      return true;
    })[0];
    if (!user) {
      return err(`user with fields: ${JSON.stringify(fields)} is not found`);
    }

    return ok(user);
  }

  async save(user: User): Promise<Result<User, any>> {
    this.users[user.id.value] = user;
    return ok(user);
  }

  async deleteById(userId: string): Promise<Result<boolean, any>> {
    if (!this.users[userId]) {
      return ok(false);
    }

    delete this.users[userId];

    return ok(true);
  }
}
