import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { User } from '@entities/user.entity';

export default class UserModel {
  public secret: string;
  public name: string;
  public email: string;
  
  public static createFromAttributeMap(map: AttributeMap): UserModel {
    const model = new this();
    model.secret = map.secret.S;
    model.name = map.name.S;
    model.email = map.email.S;
    return model;
  }

  public static createFromEntity(entity: User): UserModel {
    const model = new this();
    model.secret = entity.secret;
    model.name = entity.name;
    model.email = entity.email;
    return model;
  }

  public toEntity(): User {
    return User.build({
      secret: this.secret,
      name: this.name,
      email: this.email
    });
  }

  public toAttributeMap(): AttributeMap {
    return {
      secret: {
        S: this.secret
      },
      name: {
        S: this.name
      },
      email: {
        S: this.email
      },
    };
  }
}