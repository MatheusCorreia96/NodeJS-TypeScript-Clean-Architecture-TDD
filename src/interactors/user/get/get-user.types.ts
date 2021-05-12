export type GetUserOutput = {
  name: string;
  email: string;
}

export type GetUserInput = {
  email: string
};

export interface GetUserGateway {
  getUser(email: string): Promise<any>
}