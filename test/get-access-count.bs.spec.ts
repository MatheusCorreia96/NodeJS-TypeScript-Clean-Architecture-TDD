import 'should-sinon';
import '../src/infra/module-alias';
import 'mocha';
import * as sinon from 'sinon';

import GetAccessCountBs from '../src/interactors/access-count/get/get-access-count.bs';
import { GetAccessCountGateway } from '../src/interactors/access-count/get/get-access-count.types';

describe(' === Get Access Count Bs ===', () => {
  const params: any = {
    getAccessCountImpl: <GetAccessCountGateway>{
      getCount: sinon.stub(),
    },
  };

  let business: GetAccessCountBs;

  beforeEach(() => {
    sinon.reset();
    business = new GetAccessCountBs(params);
  });

  context('# Execute ', () => {
    it('should get access count', async () => {
      params.getAccessCountImpl.getCount.resolves({
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
