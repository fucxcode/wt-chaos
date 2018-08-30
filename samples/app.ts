import express from "express";
import Koa from "koa";
import { Router, ExpressRouter, ExpressContext, KoaContext, KoaRouter } from "../src/router";
import * as _ from "../src/utilities";

class State {
    
    constructor(
        public uid?: string,
        public role?: string
    ) {}

}

const app = express();
const router: Router<ExpressContext<State>, State> = new ExpressRouter(app, "/api");

// const app = new Koa();
// const router: Router<KoaContext<State>, State> = new KoaRouter(app, "/api");

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

router.route(`GET`, `/user`,
    async ctx => {
        console.log(`handler 1: in`);
        await _.wait(2000);
        ctx.state.uid = "shaunxu";
        console.log(`handler 1: out`);
        // await ctx.next();
    },
    async ctx => {
        console.log(`handler 2: in`);
        await _.wait(2000);
        ctx.state.role = "member";     
        console.log(`handler 2: out`);
        // await ctx.next();
    },
    async ctx => {
        console.log(`handler 3: in`);
        await _.wait(2000);
        ctx.json({
            oid: ctx.oid,
            state: ctx.state
        });
        console.log(`handler 3: out`);
        // await ctx.next();
    },
);

router.route(`POST`, `/user`, async ctx => {
    console.log(`${Date.now()} in handler`);
    await _.wait(2000);
    await ctx.json(ctx.body);
    await _.wait(2000);
    console.log(`${Date.now()} out handler`);
});

app.listen(22222, () => {
    console.log(`ready`);
});