import { User } from '../../users/user.entity';

export default class TestUtil {
  static GiveAValidUser(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Valid Name LastName';
    user.id = '1';

    return user;
  }
}
