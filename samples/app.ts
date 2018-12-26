import { KoaApplication } from "../src/application";
import { SampleOperationContext } from "./info/sample-operation-context";
import { config } from "./config";
import { KoaContext, KoaRouter } from "../src/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { ContainerPool } from "../src/container";
import moment from "moment";
import { WTError, WTCode } from "../src/errors";

ContainerPool.registerContainer();

export class App extends KoaApplication<SampleOperationContext> {

    constructor(facades: Function[]) {
        super(
            {
                port: config.port,
                prefix: "/api",
                facades: facades,
                middlewares: []
            },
            KoaContext.toRouterMiddleware(bodyParser()),
            KoaContext.toRouterMiddleware(cors()),
            async (ctx, next) => {
                const start = Date.now();
                await next();
                console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ${ctx.method} ${ctx.originalUrl}: ${Date.now() - start}ms`);
            }
        );
    }

}