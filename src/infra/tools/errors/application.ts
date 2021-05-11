export enum ApplicationErrorMessage {
  genericError = 'Error na aplicação'
}

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'erro_aplicacao';
  }
}