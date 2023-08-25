import { err, ok, Result } from 'neverthrow';
import { Entity, Uuid } from '@app/util-kernel';
import * as Yup from 'yup';

export interface UserProps {
  pseudo: string;
}

export class User extends Entity<UserProps> {
  get pseudo(): string {
    return this.props.pseudo;
  }

  set pseudo(pseudo: string) {
    this.props.pseudo = pseudo;
  }

  private constructor(props: Required<UserProps>, id?: Uuid) {
    super(props, id);
  }

  public static isValidPseudo(
    pseudo: UserProps['pseudo'],
  ): Result<boolean, string> {
    if (
      !Yup.string()
        .required()
        .max(60)
        .min(3)
        .matches(/^[a-zA-Z0-9]*$/)
        .isValidSync(pseudo)
    ) {
      return err(`Pseudo ${pseudo} is not valid in ${JSON.stringify(pseudo)}`);
    }

    return ok(true);
  }

  public static create(props: UserProps, id?: Uuid): Result<User, string> {
    const resultPseudo = this.isValidPseudo(props.pseudo);
    if (resultPseudo.isErr()) {
      return err(resultPseudo.error);
    }

    const user = new User(
      {
        ...props,
      },
      id,
    );

    return ok(user);
  }
}
