import express from "express";
import Koa from "koa";
import { Router, ExpressRouter, ExpressContext, KoaContext, KoaRouter, Context } from "../src/router";
import * as _ from "../src/utilities";
import { route, facade, middlewares } from "../src/facade";
import { HttpMethod } from "../src/constants";

class State {

    constructor(
        public uid?: string,
        public role?: string
    ) { }

}

// const app = express();
// const router: Router<ExpressContext<State>, State> = new ExpressRouter(app, "/api");

const app = new Koa();
const router: Router<KoaContext<State>, State> = new KoaRouter(app, "/api");

router.proxy = true;

// router.use(async ctx => {
//     console.log(`${Date.now()} in middleware1`);
//     await _.wait(2000);
//     ctx.state.uid = "shaunxu";
//     await ctx.next();
//     await _.wait(2000);
//     console.log(`${Date.now()} out middleware1`);
// });

// router.use(async ctx => {
//     console.log(`${Date.now()} in middleware2`);
//     await _.wait(2000);
//     await ctx.next();
//     await _.wait(2000);
//     console.log(`${Date.now()} out middleware2`);
// });

// router.route(`GET`, `/user`,
//     async ctx => {
//         console.log(`handler 1: in`);
//         await _.wait(2000);
//         ctx.state.uid = "shaunxu";
//         console.log(`handler 1: out`);
//         // await ctx.next();
//     },
//     async ctx => {
//         console.log(`handler 2: in`);
//         await _.wait(2000);
//         ctx.state.role = "member";     
//         console.log(`handler 2: out`);
//         // await ctx.next();
//     },
//     async ctx => {
//         console.log(`handler 3: in`);
//         await _.wait(2000);
//         ctx.json({
//             oid: ctx.oid,
//             state: ctx.state
//         });
//         console.log(`handler 3: out`);
//         // await ctx.next();
//     },
// );

// router.route(`POST`, `/user`, async ctx => {
//     console.log(`${Date.now()} in handler`);
//     await _.wait(2000);
//     await ctx.json(ctx.body);
//     await _.wait(2000);
//     console.log(`${Date.now()} out handler`);
// });

@facade(router)
@route("sys/internal")
@middlewares(async (ctx: Context<State>) => {
    console.log(1);
    await _.wait(1000);
    ctx.state.uid = "123";
    console.log(2);
    await _.wait(1000);
})
@middlewares(async (ctx: Context<State>) => {
    console.log(3);
    await _.wait(1000);
    ctx.state.role = "NB";
    console.log(4);
    await _.wait(1000);
})
// @ts-ignore
class MyFacade {


    @route("ping", HttpMethod.GET)
    // @ts-ignore
    public async ping(ctx: Context<State>): Promise<string> {
        console.log(5);
        await _.wait(1000);
        const result = "PONG!";
        console.log(6);
        await _.wait(1000);
        return result;
    }

    @route("say", HttpMethod.POST)
    // @ts-ignore
    public async say(ctx: Context<State>): Promise<any> {
        return {
            oid: ctx.oid,
            state: ctx.state,
            incoming: ctx.body
        };
    }

}

const myFacade = new MyFacade();

app.listen(22222, () => {
    console.log(`ready`);
});