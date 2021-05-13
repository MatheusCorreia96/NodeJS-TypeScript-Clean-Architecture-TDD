import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import CreateUserBs from '../src/interactors/user/create/create-user.bs';
import {
  CreateUserGateway,
  CreateUserInput,
} from '../src/interactors/user/create/create-user.types';
import { User } from '@entities/user.entity';
import {
  ApplicationError,
  ApplicationErrorMessage,
} from '../src/infra/tools/errors/application';

describe(' === Create User Bs ===', () => {
  const params: any = {
    createUserImpl: <CreateUserGateway>{
      create: sinon.stub(),
      findByEmail: sinon.stub(),
      createHashFromSecret: sinon.stub(),
    },
  };

  let business: CreateUserBs;

  beforeEach(() => {
    sinon.reset();
    business = new CreateUserBs(params);
  });

  context('# Execute ', () => {
    it('should create user', async () => {
      const input: CreateUserInput = {
        name: 'name',
        secretKey: 'secretKey',
        email: 'email',
      };

      params.createUserImpl.findByEmail.withArgs(input.email).returns(false);
      params.createUserImpl.createHashFromSecret
        .withArgs(input.secretKey)
        .returns('1jifafa94124124');

      const secretKeyHash = '1jifafa94124124';

      const user = User.build({
        secret: secretKeyHash,
        name: input.name,
        email: input.email,
      });

      await business.execute(input);
      params.createUserImpl.create.calledOnceWith(user).should.be.eql(true);
    });

    it('User already exists, should returns error', async () => {
      const input: CreateUserInput = {
        name: 'name',
        secretKey: 'secretKey',
        email: 'email',
      };

      params.createUserImpl.findByEmail.withArgs(input.email).returns(true);
      params.createUserImpl.createHashFromSecret
        .withArgs(input.secretKey)
        .returns('1jifafa94124124');

      try {
        await business.execute(input);
        return Promise.reject('test failed');
      } catch (err) {
        (err instanceof ApplicationError).should.eql(true);
        err.message.should.eql(ApplicationErrorMessage.UserAlreadyExist);
      }
    });

    it('Secret key empty, should returns error', async () => {
      const input: CreateUserInput = {
        name: 'name',
        secretKey: undefined,
        email: 'email',
      };

      try {
        await business.execute(input);
        return Promise.reject('test failed');
      } catch (err) {
        (err instanceof ApplicationError).should.eql(true);
        err.message.should.eql(ApplicationErrorMessage.SecretKeyEmpty);
      }
    });
  });
});
