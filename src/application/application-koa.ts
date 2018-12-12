import { Application, ApplicationOptions } from "./application";
import { KoaContext, KoaRouter, RouterMiddleware } from "../router";
import Koa from "koa";

export class KoaApplication<TState> extends Application<KoaContext<TState>, TState, KoaRouter<TState>, Koa> {
    
    private _middlewares: RouterMiddleware<KoaContext<TState>, TState>[];

    constructor(options: ApplicationOptions<KoaContext<TState>, TState>, ...middlewares: RouterMiddleware<KoaContext<TState>, TState>[]) {
        super(options);

        this._middlewares = middlewares;
    }

    protected initializeServer(): Koa {
        const server = new Koa();
        for (const middleware of this._middlewares) {
            server.use(async (ctx, next) => {
                await middleware(new KoaContext<TState>(ctx), next);
            });
        }
        return server;
    }

    protected initializeRouter(server: Koa, prefix?: string): KoaRouter<TState> {
        return new KoaRouter<TState>(server, prefix);
    }

}