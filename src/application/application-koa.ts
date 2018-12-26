import { Application, ApplicationOptions } from "./application";
import { KoaContext, KoaRouter, RouterMiddleware } from "../router";
import Koa from "koa";
import { OperationContext } from "../router/operation-context";
import { WTError, WTCode } from "../errors";

export class KoaApplication<TState extends OperationContext> extends Application<KoaContext<TState>, TState, KoaRouter<TState>, Koa> {
    
    private _middlewares: RouterMiddleware<KoaContext<TState>, TState>[];

    constructor(options: ApplicationOptions<KoaContext<TState>, TState>, ...middlewares: RouterMiddleware<KoaContext<TState>, TState>[]) {
        super(options);

        this._middlewares = middlewares;
        // append default error handler middleware if not specified in `options.customErrorHandler`
        this._middlewares.push(this.options.customErrorHandler || (async (ctx, next) => {
            try {
                await next();
            }
            catch (error) {
                if (error.toHttpResponseValue) {
                    const wtError = <WTError>error;
                    ctx.responseBody = wtError.toHttpResponseValue();
                }
                else {
                    ctx.responseBody = {
                        code: WTCode.internalError,
                        message: error.message || `router middleware error ${ctx.originalUrl}`
                    };
                }
            }
        }));
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