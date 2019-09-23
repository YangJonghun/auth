import "reflect-metadata";
import Koa from "koa";
import Router from '@koa/router';
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import {UserResolver} from './UserResolver';
import { createConnection } from "typeorm";
// import {createConnection} from "typeorm";
// import {User} from "./entity/User";

(async () => {
    const app = new Koa();
    const router = new Router();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        })
    });
    
    apolloServer.applyMiddleware({ app });
    
    router.get('/', (ctx, _next) => ctx.body = 'hello');

    await createConnection();
    
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(4000, () => {
        console.log('express server started')
    });
})()

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
