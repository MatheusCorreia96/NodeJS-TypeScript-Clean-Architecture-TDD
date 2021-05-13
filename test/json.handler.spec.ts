import { expect } from 'chai';
import 'mocha';
import 'should-sinon';
import * as sinon from 'sinon';
import { InvalidJsonError } from '../src/infra/tools/errors/invalid-json';
import JsonHandler from '../src/adapters/handlers/json.handler';

describe('=== Json Handler ===', () => {
  let jsonHandler: JsonHandler;

  const fs = {
    readFile: sinon.stub(),
  };

  const path = {
    resolve: sinon.stub(),
  };

  const ajv = {
    getSchema: sinon.stub(),
    addSchema: sinon.stub(),
    compile: sinon.stub(),
  };

  const ajvLocalize = {
    ['pt-BR']: sinon.stub(),
  };

  const params: any = {
    fs,
    path,
    ajv,
    ajvLocalize,
  };

  beforeEach(() => {
    sinon.reset();
    jsonHandler = new JsonHandler(params);
  });

  context('# getSchema', () => {
    it('should return schema from cache', async () => {
      const schemaName = 'schemaName123';
      const expectedSchema = 'schema123';

      ajv.getSchema.withArgs(schemaName).returns(expectedSchema);

      sinon
        .stub(jsonHandler, 'validate')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return this['getSchema'](schemaName);
        });

      const schema = await jsonHandler.validate('teste', {});

      expect(schema).be.equals(expectedSchema);
      expect(ajv.getSchema.calledTwice).be.true;
      expect(fs.readFile.called).be.false;
    });

    it('should throw an unexpected error when reading file', async () => {
      const schemaName = 'schemaName123';
      const expectedSchemaPath = 'schemaPath123';
      const expectedError = new Error('readFileError');

      ajv.getSchema.withArgs(schemaName).returns(null);

      path.resolve
        .withArgs(
          `${__dirname}/../../infra/tools/validators/json/${schemaName}.json`
        )
        .returns(expectedSchemaPath);

      fs.readFile.callsFake(function (schemaPath, callbackFunction) {
        callbackFunction(expectedError);
      });

      sinon
        .stub(jsonHandler, 'validate')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return this['getSchema'](schemaName);
        });

      try {
        await jsonHandler.validate('teste', {});
        return Promise.reject(new Error());
      } catch (err) {
        expect(err).be.equals(expectedError);
        expect(ajv.addSchema.called).be.false;
        expect(ajv.addSchema.calledTwice).be.false;
      }
    });

    it('should throw an unexpected error when adding schema to ajv', async () => {
      const schemaName = 'schemaName123';
      const expectedSchemaPath = 'schemaPath123';
      const rawData = '{ "field": "value" }';
      const expectedData = JSON.parse(rawData.toString());
      const expectedError = new Error('ajvAddError');

      ajv.getSchema.withArgs(schemaName).returns(null);

      path.resolve
        .withArgs(
          `${__dirname}/../../infra/tools/validators/json/${schemaName}.json`
        )
        .returns(expectedSchemaPath);

      fs.readFile.callsFake(function (schemaPath, callbackFunction) {
        callbackFunction(null, rawData);
      });

      ajv.addSchema.withArgs(expectedData, schemaName).throws(expectedError);

      sinon
        .stub(jsonHandler, 'validate')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return this['getSchema'](schemaName);
        });

      try {
        await jsonHandler.validate('teste', {});
        return Promise.reject(new Error());
      } catch (err) {
        expect(err).be.equals(expectedError);
        expect(ajv.addSchema.called).be.true;
        expect(ajv.addSchema.calledTwice).be.false;
      }
    });

    it('should return schema from reading file', async () => {
      const schemaName = 'schemaName123';
      const expectedSchemaPath = 'schemaPath123';
      const rawData = '{ "field": "value" }';
      const expectedData = JSON.parse(rawData.toString());
      const expectedSchema = 'schema123';

      ajv.getSchema.withArgs(schemaName).onFirstCall().returns(null);

      path.resolve
        .withArgs(
          `${__dirname}/../../infra/tools/validators/json/${schemaName}.json`
        )
        .returns(expectedSchemaPath);

      fs.readFile.callsFake(function (schemaPath, callbackFunction) {
        callbackFunction(null, rawData);
      });

      ajv.addSchema.withArgs(expectedData, schemaName).returns('123');

      ajv.getSchema.withArgs(schemaName).onSecondCall().returns(expectedSchema);

      sinon
        .stub(jsonHandler, 'validate')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return this['getSchema'](schemaName);
        });

      const schema = await jsonHandler.validate('teste', {});

      expect(schema).be.equals(expectedSchema);
      expect(ajv.addSchema.called).be.true;
      expect(ajv.getSchema.calledTwice).be.true;
    });
  });

  context('# validate', () => {
    it('should throw an unexpected error on getting defs schema', async () => {
      const expectedError = new Error('getDefsError');

      sinon
        .stub(jsonHandler, <any>'getSchema')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          throw expectedError;
        });

      try {
        await jsonHandler.validate('schema123', {});
        return Promise.reject(new Error());
      } catch (err) {
        expect(err).be.equals(expectedError);
        expect(ajv.compile.called).be.false;
      }
    });

    it('should throw an unexpected error on getting parameterized schema', async () => {
      const expectedError = new Error('getSchemaError');

      sinon
        .stub(jsonHandler, <any>'getSchema')
        .callsFake(async function (
          this: JsonHandler,
          schemaName: string
        ): Promise<any> {
          if (schemaName === 'defs') {
            return 123;
          }

          throw expectedError;
        });

      try {
        await jsonHandler.validate('schema123', {});
        return Promise.reject(new Error());
      } catch (err) {
        expect(err).be.equals(expectedError);
        expect(ajv.compile.called).be.false;
      }
    });

    it('should throw an InvalidJsonError error on validating schema', async () => {
      const expectedSchema = {
        schema: 'schema123',
      };

      sinon
        .stub(jsonHandler, <any>'getSchema')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return expectedSchema;
        });

      const expectedError: any = {
        keyword: 'keyword',
        dataPath: 'dataPath',
        message: 'message',
      };

      const expectedValidator = Object.assign(() => false, {
        errors: [expectedError],
      });

      ajv.compile.withArgs(expectedSchema.schema).returns(expectedValidator);

      ajvLocalize['pt-BR'].withArgs(expectedValidator.errors).returns(1);

      try {
        await jsonHandler.validate('schema123', {});
        return Promise.reject(new Error());
      } catch (err) {
        expect(err instanceof InvalidJsonError).be.true;

        expect(err.translatedErrors).be.deep.equals([
          {
            chave: expectedError.keyword,
            caminho: expectedError.dataPath,
            mensagem: expectedError.message,
          },
        ]);

        expect(ajv.compile.called).be.true;
      }
    });

    it('should validate schema', async () => {
      const expectedSchema = {
        schema: 'schema123',
      };

      sinon
        .stub(jsonHandler, <any>'getSchema')
        .callsFake(async function (this: JsonHandler): Promise<any> {
          return expectedSchema;
        });

      const expectedValidator = () => true;

      ajv.compile.withArgs(expectedSchema.schema).returns(expectedValidator);

      await jsonHandler.validate('schema123', {});

      expect(ajv.compile.called).be.true;
      expect(ajvLocalize['pt-BR'].called).be.false;
    });
  });
});
