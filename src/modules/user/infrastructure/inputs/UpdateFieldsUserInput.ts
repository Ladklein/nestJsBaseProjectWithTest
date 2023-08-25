import { IsString } from 'class-validator';

export class UpdateFieldsUserInput {
  @IsString()
  pseudo: string;
}
