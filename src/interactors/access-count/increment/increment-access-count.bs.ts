import { AppContainer } from 'infra/bootstrap/register';
import { IncrementAccessCountGateway } from './increment-access-count.types';

export default class IncrementAccessCountBs {
  private gateway: IncrementAccessCountGateway;

  constructor(params: AppContainer) {
    this.gateway = params.incrementAccessCountImpl;
  }

  public async execute(): Promise<number> {
    const count = await this.gateway.incrementCount();

    return count.data.value;
  }
}