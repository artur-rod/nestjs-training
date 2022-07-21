import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserDTO {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'This field cannot be empty' })
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'This field cannot be empty' })
  email: string;
}
