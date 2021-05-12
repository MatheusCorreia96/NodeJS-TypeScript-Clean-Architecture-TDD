import { AppContainer } from 'infra/bootstrap/register';
import { GetAccessCountGateway } from './get-access-count.types';

export default class GetAccessCountBs {
  private gateway: GetAccessCountGateway;

  constructor(params: AppContainer) {
    this.gateway = params.getAccessCountImpl;
  }

  public async execute(): Promise<number> {
    const count = await this.gateway.getCount();
    return count.data.value;
  }
}