import { KoaApplication } from "../src/application";
import { OperationContext } from "./info/operation-context";
import { config } from "./config";
import { KoaContext, KoaRouter } from "../src/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { ContainerPool } from "../src/container";
import moment from "moment";

ContainerPool.registerContainer();

export class App extends KoaApplication<OperationContext> {

    constructor(facades: Function[]) {
        super(
            {
                port: config.port,
                prefix: "/api",
                facades: facades,
                middlewares: [
                    async (ctx, next) => {
                        ctx.state.oid = ctx.oid;
                        ctx.state.path = ctx.path;
                        await next();
                    }
                ]
            },
            KoaContext.convertMiddleware(bodyParser()),
            KoaContext.convertMiddleware(cors()),
            async (ctx, next) => {
                const start = Date.now();
                await next();
                console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ${ctx.method} ${ctx.originalUrl}: ${Date.now() - start}`);
            }
        );
    }

}