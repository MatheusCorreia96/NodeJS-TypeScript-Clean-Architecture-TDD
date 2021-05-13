import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import GetUserBs from '../src/interactors/user/get/get-user.bs';
import {
  GetUserGateway,
  GetUserInput,
  GetUserOutput,
} from '../src/interactors/user/get/get-user.types';
import { User } from '@entities/user.entity';
import {
  ApplicationError,
  ApplicationErrorMessage,
} from '../src/infra/tools/errors/application';

describe(' === Get User Bs ===', () => {
  const params: any = {
    getUserImpl: <GetUserGateway>{
      getUser: sinon.stub(),
    },
  };

  let business: GetUserBs;

  beforeEach(() => {
    sinon.reset();
    business = new GetUserBs(params);
  });

  context('# Execute ', () => {
    it('should get user', async () => {
      const input: GetUserInput = {
        email: 'email',
      };

      const output: GetUserOutput = {
        name: 'user.name',
        email: 'user.email',
      };

      params.getUserImpl.getUser
        .withArgs(input.email)
        .resolves({ name: 'user.name', email: 'user.email' });

      const response = await business.execute(input);
      response.should.be.eql(output);
    });

    it('User not exists, should returns error', async () => {
      const input: GetUserInput = {
        email: 'email',
      };

      const output: GetUserOutput = {
        name: 'user.name',
        email: 'user.email',
      };

      params.getUserImpl.getUser.withArgs(input.email).resolves(undefined);

      try {
        await business.execute(input);
        return Promise.reject('test failed');
      } catch (err) {
        (err instanceof ApplicationError).should.eql(true);
        err.message.should.eql(ApplicationErrorMessage.UserNotExist);
      }
    });
  });
});
