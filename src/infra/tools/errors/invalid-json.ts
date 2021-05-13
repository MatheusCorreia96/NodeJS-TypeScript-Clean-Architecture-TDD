import Ajv from 'ajv';
import { ApplicationError } from 'infra/tools/errors/application';

export type TranslatedJsonError = {
  chave: string,
  caminho: string,
  mensagem: string,
  valoresPermitidos?: string[]
}

export class InvalidJsonError extends ApplicationError {
  public translatedErrors: TranslatedJsonError[];

  constructor(errors: Ajv.ErrorObject[]) {
    super('Valores ou tipos de campo inválidos');
    this.name = 'json_invalido';

    this.translatedErrors = errors.map((error) => {
      const translatedError: TranslatedJsonError = {
        chave: error.keyword,
        caminho: error.dataPath,
        mensagem: error.message
      };

      if (error.params && typeof error.params === 'object' && (<any>error.params).allowedValues) {
        translatedError.valoresPermitidos = (<any>error.params).allowedValues;
      }

      return translatedError;
    });
  }
}