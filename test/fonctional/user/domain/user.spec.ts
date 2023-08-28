import { User } from '../../../../src/modules/user/domain/user';

describe('user - Domain', () => {
  it('create user with success', () => {
    const pseudo = 'Test12';
    const user = User.create({ pseudo })._unsafeUnwrap();
    expect(user.pseudo).toBe(pseudo);
    expect(user.id).not.toBeNull();
  });

  const errorCases = [
    {
      case: 'Invalid pseudo input : so long',
      inputs: { pseudo: 'a'.repeat(100) },
    },
    {
      case: 'Invalid pseudo input : so small',
      inputs: { pseudo: 'a'.repeat(2) },
    },
    {
      case: 'Invalid pseudo input : not valid character',
      inputs: { pseudo: 'aaaazzzé' },
    },
    {
      case: 'Invalid pseudo input : required',
      inputs: { pseudo: '' },
    },
  ];

  it.each(errorCases)('Error case: $case', async ({ inputs }) => {
    const errorUser = User.create({
      pseudo: inputs.pseudo,
    })._unsafeUnwrapErr();

    expect(errorUser).toBe(
      `Pseudo ${inputs.pseudo} is not valid in ${JSON.stringify(
        inputs.pseudo,
      )}`,
    );
  });
});
