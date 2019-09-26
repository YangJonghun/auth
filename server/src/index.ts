import "dotenv/config";
import "reflect-metadata";
import Koa from "koa";
import Router from "@koa/router";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";

import { User } from "./entity/User";
import { UserResolver } from "./UserResolver";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

(async () => {
  const app = new Koa();
  const router = new Router();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ ctx }) => ctx
  });

  apolloServer.applyMiddleware({ app });

  router.get("/", (ctx, _next) => (ctx.body = "hello"));

  router.post("/refresh_token", async ctx => {
    const token = ctx.cookies.get("jid");
    if (!token) {
      ctx.body = { ok: false, accessToken: "" };
      return;
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      ctx.body = { ok: false, accessToken: "" };
      return;
    }

    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      ctx.body = { ok: false, accessToken: "" };
      return;
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      ctx.body = { ok: false, accessToken: "" };
      return;
    }

    sendRefreshToken(ctx, createRefreshToken(user));

    ctx.status = 404;
    ctx.body = { ok: true, accessToken: createAccessToken(user) };
  });

  await createConnection();

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(4000, () => {
    console.log("koa server started");
  });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
