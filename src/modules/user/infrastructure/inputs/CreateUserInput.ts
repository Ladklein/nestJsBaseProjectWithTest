import { IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  pseudo: string;
}
