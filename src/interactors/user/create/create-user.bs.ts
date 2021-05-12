import { AppContainer } from 'infra/bootstrap/register';
import { CreateUserGateway, CreateUserInput } from './create-user.types';
import { User } from '@entities/user.entity';

export default class CreateUserBs {
  private gateway: CreateUserGateway;

  constructor(params: AppContainer) {
    this.gateway = params.createUserImpl;
  }

  public async execute(input: CreateUserInput){
    const user = await this.buildUser(input);

    const isUserExist = await this.gateway.findByEmail(input.email);

    if (isUserExist){
      throw new Error('User already registered')
    }
      
    await this.gateway.create(user);
  }

  private async buildUser(input: CreateUserInput): Promise<User> {
    console.log('input buildUser', input);
    if(!input.secretKey){
      throw new Error('SecretKey cannot be empty');
    }

    const secretKeyHash = await this.gateway.createHashFromSecret(input.secretKey);
    return User.build({
      secret: secretKeyHash,
      name: input.name,
      email: input.email
    });
  }
}