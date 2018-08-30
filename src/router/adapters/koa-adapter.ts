import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler, INextFunction } from "../router";
import Koa from "koa";
import KoaRouterRaw from "koa-router";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";

class KoaContext<T> extends Context<T> {

    private _ctx: Koa.Context;
    
    constructor(ctx: Koa.Context, next?: INextFunction) {
        super(() => ctx.state, ctx.req, ctx.res, next, () => {
            if (!ctx.state.oid) {
                ctx.state.oid = uuid.v4();
            }
            return ctx.state.oid;
        });
        this._ctx = ctx;
    }
    
    public json(data: any): KoaContext<T> {
        this._ctx.body = data;
        return this;
    }
}

class KoaRouter<T> extends Router<KoaContext<T>, T> {

    private _app: Koa;

    private _router: KoaRouterRaw;

    constructor(app: Koa, prefix?: string) {
        super(prefix);
        this._app = app;
        this._router = new KoaRouterRaw();
        this._app.use(this._router.routes());
        this._app.use(this._router.allowedMethods());
    }

    public onUse(handler: RouterMiddleware<KoaContext<T>, T>): void {
        this._router.use(async (ctx, next) => {
            await handler(new KoaContext<T>(ctx, next));
        });
    }

    public onRoute(method: string, path: string | RegExp, ...handlers: RouterHandler<KoaContext<T>, T>[]): void {
        const fn = (this._router as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            fn.call(this._router, path, ..._.map(handlers, handler => {
                return async (ctx: Koa.Context, next: INextFunction) => {
                    await handler(new KoaContext<T>(ctx, next));
                    // in koa we MUST invoke `await next()` regardless if multiple handlers registered
                    await next();
                };
            }));
        }
        else {
            throw new Error(`Koa does not support method "${method}"`);
        }
    }

}

export { KoaRouter, KoaContext };