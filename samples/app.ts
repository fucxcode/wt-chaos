import express from "express";
import Koa from "koa";
import { Router, ExpressRouter, ExpressContext, KoaContext, KoaRouter } from "../src/router";
import * as _ from "../src/utilities";

class State {
    
    constructor(
        public uid?: string
    ) {}

}

// const app = express();
// const router: Router<ExpressContext<State>, State> = new ExpressRouter(app);

const app = new Koa();
const router: Router<KoaContext<State>, State> = new KoaRouter(app, "/api");

router.use(async ctx => {
    console.log(`${Date.now()} in middleware1`);
    await _.wait(2000);
    ctx.state.uid = "shaunxu";
    await ctx.next();
    await _.wait(2000);
    console.log(`${Date.now()} out middleware1`);
});

router.use(async ctx => {
    console.log(`${Date.now()} in middleware2`);
    await _.wait(2000);
    await ctx.next();
    await _.wait(2000);
    console.log(`${Date.now()} out middleware2`);
});

router.route(`GET`, `/user`, async ctx => {
    console.log(`${Date.now()} in handler`);
    await _.wait(2000);
    await ctx.json({
        oid: ctx.oid,
        id: ctx.state.uid,
        name: `Shaun Xu`
    });
    await _.wait(2000);
    console.log(`${Date.now()} out handler`);
});

app.listen(22222, () => {
    console.log(`ready`);
});