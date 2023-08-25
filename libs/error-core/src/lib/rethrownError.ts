// inspired by https://stackoverflow.com/questions/42754270/re-throwing-exception-in-nodejs-and-not-losing-stack-trace

export class RethrownError extends Error {
  public originalError: Error;

  public stackBeforeRethrow: string | undefined;

  constructor(message: string, error: Error) {
    super(message);

    if (!error) {
      throw new Error('RethrownError requires a message and error');
    }

    const rootError = this.getRootError(error);

    this.originalError = error;
    this.name = rootError.constructor.name;
    this.stackBeforeRethrow = this.stack;
    const messageLines = (this.message.match(/\n/g) || []).length + 1;
    this.stack = this.stack
      ? this.stack
          .split('\n')
          .slice(0, messageLines + 1)
          .join('\n') +
        '\n' +
        rootError.stack
      : undefined;
  }

  private getRootError(error: Error): Error {
    return error instanceof RethrownError
      ? this.getRootError(error.originalError)
      : error;
  }
}
