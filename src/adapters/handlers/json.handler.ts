import Ajv from 'ajv';
import localize from 'ajv-i18n';
import fs from 'fs';
import path from 'path';
import { AppContainer } from 'infra/bootstrap/register';
import { InvalidJsonError } from '../../infra/tools/errors/invalid-json';

export default class JsonHandler {

  private fs: typeof fs;
  private path: typeof path;
  private ajv: Ajv.Ajv;
  private localize: typeof localize;

  constructor(params: AppContainer) {
    this.fs = params.fs;
    this.path = params.path;
    this.ajv = params.ajv;
    this.localize = params.ajvLocalize;
  }

  private async getSchema(schemaName: string): Promise<Ajv.ValidateFunction> {
    if (this.ajv.getSchema(schemaName)) {
      return this.ajv.getSchema(schemaName);
    }

    const schemaPath = this.path.resolve(`${__dirname}/../../infra/tools/validators/json/${schemaName}.json`);

    return new Promise((resolve, reject) => {
      this.fs.readFile(schemaPath, (err, data) => {
        if (err) {
          reject(err);
        }

        try {
          const schemaObj = JSON.parse(data.toString());
          this.ajv.addSchema(schemaObj, schemaName);
          resolve(this.ajv.getSchema(schemaName));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public async validate(schemaName: string, data: unknown): Promise<void> {

    try {
      const jsonSchema = await this.getSchema(schemaName);

      const validator = this.ajv.compile(jsonSchema.schema);
      const isValid = validator(data);

      if (!isValid) {
        this.localize['pt-BR'](validator.errors);
        throw new Ajv.ValidationError(validator.errors);
      }
    } catch (err) {
      if (!(err instanceof Ajv.ValidationError)) {
        throw err;
      }

      throw new InvalidJsonError(err.errors);
    }
  }

}