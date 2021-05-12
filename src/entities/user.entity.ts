export interface UserProps {
  secret: string;
  name: string;
  email: string;
}

export class User {
  private _secret: string;
  private _name: string;
  private _email: string;

  public static build(obj: UserProps): User {
    const user = new this();

    user.secret = obj.secret;
    user.name = obj.name;
    user.email = obj.email;

    return user
  }

  set secret(secret: string) {
    if(!secret || typeof secret !== 'string'){
      throw new Error('Invalid secret');
    }

    this._secret = secret;
  }

  get secret() {
    return this._secret;
  }

  set name(name: string) {
    if(!name || typeof name !== 'string'){
      throw new Error('Invalid name');
    }

    this._name = name;
  }

  get name() {
    return this._name;
  }

  set email(email: string) {
    if(!email || typeof email !== 'string'){
      throw new Error('Invalid email');
    }

    this._email = email;
  }

  get email() {
    return this._email;
  }
}