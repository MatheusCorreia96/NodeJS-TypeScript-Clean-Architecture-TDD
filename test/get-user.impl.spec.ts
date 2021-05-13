import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';
import should from 'should';

import GetUserImpl from '../src/adapters/gateways/user/get/get-user.impl';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import UserModel from '../src/infra/db/models/user';
import { User } from '@entities/user.entity';

describe(' === Get User ===', () => {
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
  };

  let implementation: GetUserImpl;

  beforeEach(() => {
    sinon.reset();
    implementation = new GetUserImpl(params);
  });

  context('# Find User By Email ', () => {
    it('should find user', async () => {
      const email = 'email';
      const name = 'name';
      const secret = 'secret';

      const model = new UserModel();
      model.email = email;
      model.name = name;
      model.secret = secret;

      const user = User.build({
        email: model.email,
        name: model.name,
        secret: model.secret,
      });

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

      getItemStub.resolves({ Item: model.toAttributeMap() });

      const response = await implementation.getUser(email);
      params.dynamoDB.getItem.should.be.calledWith(query);
      response.should.eql(user);
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

      const response = await implementation.getUser(email);

      params.dynamoDB.getItem.should.be.calledWith(query);
    });
  });
});
