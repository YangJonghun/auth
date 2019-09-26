import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-koa";
import { verify } from "jsonwebtoken";

import { CustomApolloContext } from "./CustomContext";

export const isAuth: MiddlewareFn<CustomApolloContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new AuthenticationError("Unauthorized");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("Unauthorized");
  }
  return next();
};
