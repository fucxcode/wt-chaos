import { Application, ApplicationOptions, KoaApplication } from "../src/application";
import { KoaContext, KoaRouter, ExpressContext, ExpressRouter, Context, RouterMiddleware, INextFunction } from "../src/router";
import Koa from "koa";
import { ContainerPool } from "../src/container";
import * as _ from "../src/utilities";
import { WTCode } from "../src/errors/code";
import bodyParser from "koa-bodyparser";
import express from "express";
import { facade, get, post } from "../src/facade";

ContainerPool.registerContainer();

class State {

    constructor(
        public uid?: string,
        public role?: string
    ) { }

}

@facade()
// @ts-ignore
class Facade1 {

    @get("/ping")
    // @ts-ignore
    public async ping(ctx: Context<State>): Promise<string> {
        return "PONG!";
    }

}

@facade()
// @ts-ignore
class Facade2 {

    @post("/echo")
    // @ts-ignore
    public async echo(ctx: Context<State>): Promise<{
        input: any,
        at: number
    }> {
        return {
            input: ctx.requestBody,
            at: Date.now()
        };
    }

}

const options: ApplicationOptions<KoaContext<State>, State> = {
    port: 22222,
    hostname: "0.0.0.0",
    prefix: "/api",
    facades: [
        Facade1,
        Facade2
    ],
    middlewares: []
};

const app = new KoaApplication<State>(options,
    KoaContext.convertMiddleware(bodyParser()),
    KoaContext.convertMiddleware(async (ctx, next) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        ctx.response.set("Access-Control-Allow-Credentials", "true");
        ctx.response.set(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, X-Cookies"
        );
        ctx.response.set(
            "Access-Control-Allow-Methods",
            "PUT,POST,GET,DELETE,OPTIONS"
        );
        if (ctx.request.method === "OPTIONS") {
            ctx.response.status = WTCode.ok;
        }
        await next();
    }),
    async (ctx, next) => {
        const start = Date.now();
        await next();
        const duration = Date.now() - start;
        console.log(`[${ctx.oid}] ${duration}`);
    }
);

app.start().then(result => {
    console.log(result.port);
}).catch(error => {
    console.log(error);
});
