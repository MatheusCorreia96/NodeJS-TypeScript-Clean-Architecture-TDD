import { GetUserGateway } from '@interactors/user/get/get-user.types';
import { AppContainer } from 'infra/bootstrap/register';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import { Config } from 'infra/config/config';
import AWS from 'aws-sdk';
import UserModel from 'infra/db/models/user';

export default class GetUserImpl implements GetUserGateway {
  private config: Config;
  private dynamoDB: AWS.DynamoDB;

  constructor(params: AppContainer) {
    this.config = params.config;
    this.dynamoDB = params.dynamoDB;
  }

  public async getUser(email: string): Promise<any> {
    const query: GetItemInput = {
      TableName: this.config.databases.dynamoDB.Users.table,
      Key: {
        email: {
          S: email
        }
      }
    }

    const response = await this.dynamoDB.getItem(query).promise();

    if(!response.Item) {
      return null;
    }

    const model = UserModel.createFromAttributeMap(response.Item);
    return model.toEntity();
  }

}