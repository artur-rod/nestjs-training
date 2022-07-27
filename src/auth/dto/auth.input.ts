import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AuthImput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Email required' })
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}
