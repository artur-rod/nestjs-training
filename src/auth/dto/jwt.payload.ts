import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../users/user.entity';

@ObjectType()
export class JwtPayload {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  sub: string;
}
