import { Context } from 'koa';

export interface CustomApolloContext extends Context {
  payload?: { userId: string };
}
