import { IncrementAccessCountGateway } from '@interactors/access-count/increment/increment-access-count.types';
import { Config } from 'infra/config/config';
import { AppContainer } from 'infra/bootstrap/register';
import { AxiosStatic, AxiosRequestConfig } from 'axios'

export default class IncrementAccessCountImpl implements IncrementAccessCountGateway {
  private config: Config;
  private axios: AxiosStatic;

  constructor(params: AppContainer) {
    this.config = params.config;
    this.axios = params.axios;
  }

  public async incrementCount(): Promise<any> {
   const options: AxiosRequestConfig = {
      method: 'get',
      url: `${this.config.api.url}/hit/${this.config.api.name}/${this.config.api.secretKey}`
    }

    return this.axios(options);
  }
}