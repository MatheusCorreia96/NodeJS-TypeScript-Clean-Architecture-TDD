import { AppContainer } from 'infra/bootstrap/register';
import { AccessCountGateway, PostAccessCountOutput } from './access-count.types';

export default class AccessCountBs {
  private gateway: AccessCountGateway;

  constructor(params: AppContainer) {
    this.gateway = params.accessCountImpl;
  }

  public async execute(): Promise<number> {
    const count = await this.gateway.incrementCount();

    return count.data.value;
  }
}