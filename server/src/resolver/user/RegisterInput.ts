import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';
import { User } from '../../entity/User';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'this email is already exist' })
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  @Length(1, 30)
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 30)
  lastName?: string;
}
