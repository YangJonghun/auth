import { Context } from "koa";

export const sendRefreshToken = (ctx: Context, token: string) => {
  ctx.cookies.set("jid", token, { httpOnly: true });
};
