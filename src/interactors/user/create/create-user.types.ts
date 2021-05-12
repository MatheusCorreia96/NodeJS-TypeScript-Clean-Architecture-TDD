import { User } from '@entities/user.entity';

export type CreateUserInput = {
  name: string,
  secretKey: string,
  email: string
};

export interface CreateUserGateway {
  create(user: User): Promise<any>,
  findByEmail(email: string): Promise<boolean>,
  createHashFromSecret(secret: string): Promise<string>
}