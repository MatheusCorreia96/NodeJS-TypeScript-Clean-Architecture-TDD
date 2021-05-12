import { AppContainer } from 'infra/bootstrap/register';
import { GetUserGateway, GetUserInput, GetUserOutput } from './get-user.types';
import { ApplicationError, ApplicationErrorMessage} from 'infra/tools/errors/application';

export default class GetUserBs {
  private gateway: GetUserGateway;

  constructor(params: AppContainer) {
    this.gateway = params.getUserImpl;
  }

  public async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.gateway.getUser(input.email);

    if (!user){
      throw new ApplicationError(ApplicationErrorMessage.UserNotExist);
    }

    return {
      name: user.name,
      email: user.email
    };
  }
}