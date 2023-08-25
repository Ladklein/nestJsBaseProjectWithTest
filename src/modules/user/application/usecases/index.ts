import { UpdateUserUsecase } from './user/updateUser/updateUser.usecase';
import { DeleteUserUsecase } from './user/deleteUser/deleteUser.usecase';
import { CreateUserUsecase } from './user/createUser/createUser.usecase';

export const getUsecases = () => [
  UpdateUserUsecase,
  DeleteUserUsecase,
  CreateUserUsecase,
];
