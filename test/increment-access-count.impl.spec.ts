import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import IncrementAccessCountImpl from '../src/adapters/gateways/access-count/increment/increment-access-count.impl';
import { AxiosRequestConfig } from 'axios';

describe(' === Increment Access Count ===', () => {
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

  let implementation: IncrementAccessCountImpl;

  beforeEach(() => {
    sinon.reset();
    implementation = new IncrementAccessCountImpl(params);
  });

  context('# Increment count ', () => {
    it('should increment count', async () => {
      const options: AxiosRequestConfig = {
        method: 'get',
        url: `${params.config.api.url}/hit/${params.config.api.name}/${params.config.api.secretKey}`,
      };

      params.axios.withArgs(options).resolves();

      await implementation.incrementCount();
      params.axios.calledOnceWith(options).should.be.eql(true);
    });
  });
});
