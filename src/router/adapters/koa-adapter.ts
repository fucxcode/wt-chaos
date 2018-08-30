import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler, INextFunction } from "../router";
import Koa from "koa";
import KoaRouterRaw from "koa-router";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";

class KoaContext<T> extends Context<T> {

    private _ctx: Koa.Context;
    
    constructor(ctx: Koa.Context, next?: INextFunction) {
        super(ctx.state, ctx.req, ctx.res, next, () => {
            let oid = ctx.state.oid;
            if (_.isNilOrWriteSpaces(oid)) {
                oid = uuid.v4();
                ctx.state.oid = oid;
            }
            return oid as string;
        });
        this._ctx = ctx;
    }
    
    public async json(data: any): Promise<void> {
        this._ctx.body = data;
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

    public onRoute(method: string, path: string | RegExp, handler: RouterHandler<KoaContext<T>, T>): void {
        const fn = (this._router as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            fn.call(this._router, path, async (ctx: Koa.Context) => {
                await handler(new KoaContext<T>(ctx));
            });
        }
        else {
            throw new Error(`Koa does not support method "${method}"`);
        }
    }

}

export { KoaRouter, KoaContext };