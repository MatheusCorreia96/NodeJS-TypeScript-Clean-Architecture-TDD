import { GetAccessCountGateway } from '@interactors/access-count/get/get-access-count.types';
import { Config } from 'infra/config/config';
import { AppContainer } from 'infra/bootstrap/register';
import { AxiosStatic, AxiosRequestConfig } from 'axios';

export default class GetAccessCountImpl implements GetAccessCountGateway {
  private config: Config;
  private axios: AxiosStatic;

  constructor(params: AppContainer) {
    this.config = params.config;
    this.axios = params.axios;
  }

  public async getCount(): Promise<any> {
    const options: AxiosRequestConfig = {
      method: 'get',
      url: `${this.config.api.url}/info/${this.config.api.name}/${this.config.api.secretKey}`,
    };

    return this.axios(options);
  }
}
