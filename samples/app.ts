import express from "express";
import Koa from "koa";
import { Router, ExpressRouter, ExpressContext, KoaContext, KoaRouter, Context, INextFunction } from "../src/router";
import * as _ from "../src/utilities";
import { route, facade, middlewares } from "../src/facade";
import { HttpMethod } from "../src/constants";
import { ContainerPool, injectable, inject } from "../src/container";
import { WTError, WTCode } from "../src";

const container = ContainerPool.registerContainer();

class State {

    constructor(
        public uid?: string,
        public role?: string
    ) { }

}

// const app = express();
// const router: Router<ExpressContext<State>, State> = new ExpressRouter(app, "/api");

const app = new Koa();

app.use(async (ctx, next) => {
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
    if (ctx.request.method == "OPTIONS") {
        ctx.response.status = WTCode.ok;
    }
    await next();
});

// router.use(async (ctx, next) => {
//     ctx.innerContext.response.set("Access-Control-Allow-Origin", "*");
//     ctx.innerContext.response.set("Access-Control-Allow-Credentials", "true");
//     ctx.innerContext.response.set(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, X-Cookies"
//     );
//     ctx.innerContext.response.set(
//         "Access-Control-Allow-Methods",
//         "PUT,POST,GET,DELETE,OPTIONS"
//     );
//     if (ctx.innerContext.request.method == "OPTIONS") {
//         ctx.innerContext.response.status = WTCode.ok;
//     }
// });

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        if (error.toHttpResponseValue) {
            const wtError = <WTError>error;
            ctx.body = wtError.toHttpResponseValue();
        }
        else {
            console.log(error);
            ctx.body = {
                code: WTCode.internalError,
                message:
                    error.message ||
                    `router middleware error ${ctx.originalUrl}`
            };
        }
    }

    // return await next().catch(error => {
    //     if (error.toHttpResponseValue) {
    //         const wtError = <WTError>error;
    //         ctx.body = wtError.toHttpResponseValue();
    //     }
    //     else {
    //         console.log(error);
    //         ctx.body = {
    //             code: WTCode.internalError,
    //             message:
    //                 error.message ||
    //                 `router middleware error ${ctx.originalUrl}`
    //         };
    //     }
    // });
});

const router: Router<KoaContext<State>, State> = new KoaRouter(app, "/api", true);

router.proxy = true;

@injectable()
// @ts-ignore
class Service {

    public lower(name: string): string {
        return name.toLowerCase();
    }

}

@facade()
// @ts-ignore
class Facade {

    @route("/wt-error", HttpMethod.GET)
    // @ts-ignore
    public async wtError(): Promise<void> {
        throw new WTError(WTCode.forbidden, "aaa", "x", "y");
    }

    @route("/error", HttpMethod.GET)
    // @ts-ignore
    public async error(): Promise<void> {
        throw new Error("bbb");
    }

    @route("ping", HttpMethod.GET)
    // @ts-ignore
    public async ping(): Promise<string> {
        return "PONG!";
    }

}

container.resolve<Facade>(Facade);

app.listen(22222, () => {
    console.log(`ready`);
});