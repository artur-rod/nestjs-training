import { AuthType } from '../../auth/dto/auth.type';
import { AuthImput } from '../../auth/dto/auth.input';
import { User } from '../../users/user.entity';

export default class TestUtil {
  static ValidUser(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Valid Name LastName';
    user.id = '1';

    return user;
  }

  static ValidUserToCreate(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Valid Name LastName';
    user.id = '1';
    user.password = 'validPassword';

    return user;
  }
}
