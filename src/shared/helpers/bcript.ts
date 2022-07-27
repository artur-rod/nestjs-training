import { compare, hash } from 'bcrypt';

export default class bcrypt {
  constructor() {}
  static async encryptPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  static async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await compare(password, userPassword);
  }
}
