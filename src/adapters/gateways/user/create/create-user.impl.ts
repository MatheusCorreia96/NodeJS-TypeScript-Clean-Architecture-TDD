import { CreateUserGateway, CreateUserInput } from '@interactors/user/create/create-user.types';
import { AppContainer, Argon2 } from 'infra/bootstrap/register';
import { User } from '@entities/user.entity';
import UserModel from 'infra/db/models/user';
import { PutItemInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import { Config } from 'infra/config/config';
import AWS from 'aws-sdk';

export default class CreateUserImpl implements CreateUserGateway {
  private config: Config;
  private dynamoDB: AWS.DynamoDB;
  private argon2: Argon2;

  constructor(params: AppContainer) {
    this.config = params.config;
    this.dynamoDB = params.dynamoDB;
    this.argon2 = params.argon2;
  }

  public async create(user: User): Promise<any> {
    const model = UserModel.createFromEntity(user);

    const putItemOptions: PutItemInput = {
      TableName: this.config.databases.dynamoDB.Users.table,
      Item: model.toAttributeMap()
    }

    return this.dynamoDB.putItem(putItemOptions).promise();
  }

  public async findByEmail(email: string): Promise<boolean> {
    const query: GetItemInput = {
      TableName: this.config.databases.dynamoDB.Users.table,
      Key: {
        email: {
          S: email
        }
      }
    }

    const response = await this.dynamoDB.getItem(query).promise();

    console.log('response ', response);

    if(response.Item){
      return true;
    }

    return false;
  }

  public async createHashFromSecret(secret:string): Promise<string> {
    return this.argon2.hash(secret);
  }
}