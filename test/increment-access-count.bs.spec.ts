import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import IncrementAccessCountBs from '../src/interactors/access-count/increment/increment-access-count.bs';
import { IncrementAccessCountGateway } from '../src/interactors/access-count/increment/increment-access-count.types';

describe(' === Increment Count Bs ===', () => {
  const params: any = {
    incrementAccessCountImpl: <IncrementAccessCountGateway>{
      incrementCount: sinon.stub(),
    },
  };

  let business: IncrementAccessCountBs;

  beforeEach(() => {
    sinon.reset();
    business = new IncrementAccessCountBs(params);
  });

  context('# Execute ', () => {
    it('should increment count', async () => {
      params.incrementAccessCountImpl.incrementCount.resolves({
        data: {
          namespace: 'testname',
          key: 'bigsecretkey',
          value: 12,
        },
      });

      const response = await business.execute();
      response.should.eql(12);
    });
  });
});
