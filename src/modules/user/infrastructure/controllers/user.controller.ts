import 'module-alias/register';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserErrors, RethrownError } from '@app/error-core';
import { Nullable } from '@app/data-generic';
import * as updateUserErrors from '../../application/usecases/user/updateUser/updateUser.errors';
import * as deleteUserErrors from '../../application/usecases/user/deleteUser/deleteUser.errors';
import * as createUserErrors from '../../application/usecases/user/createUser/createUser.errors';
import { UpdateUserUsecase } from '../../application/usecases/user/updateUser/updateUser.usecase';
import { UserMapper } from '../mappers/userMapper';
import { UserModel } from '../models/userModel';
import { DeleteUserUsecase } from '../../application/usecases/user/deleteUser/deleteUser.usecase';
import { CreateUserInput } from '../inputs/CreateUserInput';
import { CreateUserUsecase } from '../../application/usecases/user/createUser/createUser.usecase';
import { UpdateFieldsUserInput } from '../inputs/UpdateFieldsUserInput';
import { User } from '../../domain/user';
import { UseCaseError } from '@app/util-kernel';
import { UserRoutes } from '@app/util-routes';

@Controller()
export class UserController {
  constructor(
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  @Post(UserRoutes.CreateUser)
  async createUser(
    @Body() user: CreateUserInput,
  ): Promise<Nullable<UserModel>> {
    const createUserResult = await this.createUserUsecase.execute(user);

    return createUserResult.match(
      ({ user }: { user: User }) => {
        return UserMapper.toModel(user);
      },
      (error: UseCaseError) => {
        switch (true) {
          case error instanceof createUserErrors.InvalidInputCreateUserError:
          case error instanceof createUserErrors.UserAlreadyExistError:
            throw new BadRequestException(
              UserErrors.InvalidInputUserError,
              error.message,
            );
          case error instanceof createUserErrors.CannotSaveUserError:
            throw new HttpException(
              UserErrors.CannotCreateUserError,
              HttpStatus.INTERNAL_SERVER_ERROR,
              {
                description: error.message,
              },
            );
          case error instanceof
            createUserErrors.CannotCheckForUserExistenceError:
            throw new HttpException(
              UserErrors.CannotCheckExistUserError,
              HttpStatus.INTERNAL_SERVER_ERROR,
              {
                description: error.message,
              },
            );
          default:
            throw new RethrownError(error.message, error);
        }
      },
    );
  }

  @Post(UserRoutes.UpdateUser)
  @HttpCode(200)
  async updateUser(
    @Param('id') userId: string,
    @Body() userFields: UpdateFieldsUserInput,
  ): Promise<Nullable<UserModel>> {
    const updateUserResult = await this.updateUserUsecase.execute({
      userId,
      ...userFields,
    });

    return updateUserResult.match(
      ({ user }: { user: User }) => UserMapper.toModel(user),
      (error: UseCaseError) => {
        switch (true) {
          case error instanceof updateUserErrors.InvalidUserError:
            throw new BadRequestException(
              UserErrors.InvalidInputUserError,
              error.message,
            );
          case error instanceof updateUserErrors.CannotFindUserError:
            throw new NotFoundException(
              UserErrors.CannotFindUserError,
              error.message,
            );
          case error instanceof updateUserErrors.CannotUpdateUserError:
            throw new HttpException(
              UserErrors.CannotUpdateUserError,
              HttpStatus.INTERNAL_SERVER_ERROR,
              {
                description: error.message,
              },
            );
          default:
            throw new RethrownError(error.message, error);
        }
      },
    );
  }

  @Delete(UserRoutes.DeleteUser)
  async deleteUser(
    @Param('id') userId: string,
  ): Promise<Nullable<{ deleted: boolean }>> {
    const getUserResult = await this.deleteUserUsecase.execute({
      userId,
    });

    return getUserResult.match(
      ({ deleted }: { deleted: boolean }) => ({ deleted }),
      (error: UseCaseError) => {
        switch (true) {
          case error instanceof deleteUserErrors.CannotFindUserError:
            throw new NotFoundException(
              UserErrors.CannotFindUserError,
              error.message,
            );
          case error instanceof deleteUserErrors.CannotDeleteUserError:
            throw new HttpException(
              UserErrors.CannotDeleteUserError,
              HttpStatus.INTERNAL_SERVER_ERROR,
              {
                description: error.message,
              },
            );
          default:
            throw new RethrownError(error.message, error);
        }
      },
    );
  }
}
