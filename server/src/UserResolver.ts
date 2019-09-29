import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from './entity/User';
import { CustomApolloContext } from './CustomContext';
import { createRefreshToken, createAccessToken } from './auth';
import { isAuth } from './isAuth';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  currentUser(@Ctx() { payload }: CustomApolloContext) {
    return User.findOne(payload!.userId);
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(@Arg('userId', () => String) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: CustomApolloContext,
  ): Promise<LoginResponse> {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error(`could not find "${email}"`);
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error(`incorrect password`);
    }

    // set refresh token as cookie (key: jid)
    sendRefreshToken(ctx, createRefreshToken(user));

    // login successful & send access token as response body
    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: CustomApolloContext) {
    sendRefreshToken(ctx, '');
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
