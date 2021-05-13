import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import GetAccessCountImpl from '../src/adapters/gateways/access-count/get/get-access-count.impl';
import { AxiosRequestConfig } from 'axios';

describe(' === Get Access Count ===', () => {
  const params: any = {
    config: {
      api: {
        url: 'https://testeurl',
        name: 'testename',
        secretKey: 'testesecret',
      },
    },
    axios: sinon.stub(),
  };

  let implementation: GetAccessCountImpl;

  beforeEach(() => {
    sinon.reset();
    implementation = new GetAccessCountImpl(params);
  });

  context('# Get Count ', () => {
    it('should return count', async () => {
      const options: AxiosRequestConfig = {
        method: 'get',
        url: `${params.config.api.url}/info/${params.config.api.name}/${params.config.api.secretKey}`,
      };

      params.axios.withArgs(options).resolves();

      await implementation.getCount();
      params.axios.calledOnceWith(options).should.be.eql(true);
    });
  });
});
