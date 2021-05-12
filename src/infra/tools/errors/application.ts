export enum ApplicationErrorMessage {
  UserAlreadyExist = 'User already registered',
  SecretKeyEmpty = 'SecretKey cannot be empty',
  UserNotExist = 'User not exist'
}

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'error_application';
  }
}