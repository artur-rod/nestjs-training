import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../../users/user.entity';

@ObjectType()
export class AuthType extends User {
  @Field()
  @IsString()
  token: string;
}
