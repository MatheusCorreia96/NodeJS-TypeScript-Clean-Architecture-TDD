import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';
import should from 'should';

import CreateUserImpl from '../src/adapters/gateways/user/create/create-user.impl';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import { User } from '@entities/user.entity';

describe(' === Create User ===', () => {
  const params: any = {
    config: {
      api: {
        url: 'https://testeurl',
        name: 'testename',
        secretKey: 'testesecret',
      },
      databases: {
        dynamoDB: {
          Users: {
            table: 'test',
          },
        },
      },
    },
    dynamoDB: {
      putItem: sinon.stub(),
      getItem: sinon.stub(),
    },
    argon2: {
      hash: sinon.stub(),
    },
  };

  let implementation: CreateUserImpl;

  beforeEach(() => {
    sinon.reset();
    implementation = new CreateUserImpl(params);
  });

  context('# Create User ', () => {
    it('should create user', async () => {
      const user = User.build({
        secret: 'secret',
        name: 'name',
        email: 'email',
      });

      const putItemStub = sinon.stub();

      params.dynamoDB.putItem.returns({
        promise: putItemStub,
      });

      putItemStub.resolves();

      await implementation.create(user);

      should(putItemStub.callCount).eql(1);
    });
  });

  context('# Find User By Email ', () => {
    it('should find user', async () => {
      const email = 'email';

      const query: GetItemInput = {
        TableName: params.config.databases.dynamoDB.Users.table,
        Key: {
          email: {
            S: email,
          },
        },
      };

      const getItemStub = sinon.stub();

      params.dynamoDB.getItem.returns({
        promise: getItemStub,
      });

      getItemStub.resolves({ Item: 'value' });

      const response = await implementation.findByEmail(email);
      params.dynamoDB.getItem.should.be.calledWith(query);
      response.should.eql(true);
    });

    it('should not find user', async () => {
      const email = 'email';

      const query: GetItemInput = {
        TableName: params.config.databases.dynamoDB.Users.table,
        Key: {
          email: {
            S: email,
          },
        },
      };

      const getItemStub = sinon.stub();

      params.dynamoDB.getItem.returns({
        promise: getItemStub,
      });

      getItemStub.resolves({ Item: undefined });

      const response = await implementation.findByEmail(email);

      params.dynamoDB.getItem.should.be.calledWith(query);
      response.should.eql(false);
    });
  });

  context('# Create Hash From Secret ', () => {
    it('should create Hash From Secret', async () => {
      const secret = 'secret';

      params.argon2.hash.withArgs(secret).resolves();

      await implementation.createHashFromSecret(secret);

      params.argon2.hash.calledOnceWithExactly(secret).should.true;
    });
  });
});
