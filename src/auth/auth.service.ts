import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import bcrypt from '../shared/helpers/bcript';
import { UsersService } from '../users/users.service';
import { AuthImput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { JwtPayload } from './dto/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: AuthImput): Promise<AuthType> {
    const user = await this.userService.findOneByEmail(data.email);
    const validatePassword = await bcrypt.validatePassword(
      data.password,
      user.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    const token = await this.jwtToken(user);
    return { token, ...user };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      username: user.name,
      sub: user.id,
    };

    return await this.jwtService.signAsync(payload);
  }
}
