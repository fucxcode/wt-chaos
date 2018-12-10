import { Context } from "../context";
import { Router, } from "../router";
import Koa from "koa";
import KoaRouterRaw from "koa-router";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";
import { IncomingHttpHeaders } from "http";
import bodyParser from "koa-bodyparser";
import { HttpMethod } from "../../constants";
import { WTCode } from "../../errors";
import { Container } from "../../container";
import { Cookies } from "../cookies";
import { INextFunction } from "../next-function";
import { RouterMiddleware } from "../router-middleware";
import { RouterHandler } from "../router-handler";

class KoaContext<T> extends Context<T> {

    private _ctx: Koa.Context;
    public get innerContext(): Koa.Context {
        return this._ctx;
    }
   
    constructor(ctx: Koa.Context, next?: INextFunction) {
        super(() => ctx.state, ctx.req, ctx.res, () => {
            if (!ctx.state.oid) {
                ctx.state.oid = uuid.v4();
            }
            return ctx.state.oid;
        });
        this._ctx = ctx;
    }

    public get headers(): IncomingHttpHeaders {
        return this._ctx.headers;
    }

    public get query(): any {
        return this._ctx.query;
    }

    public get params(): any {
        return this._ctx.params;
    }

    public get body(): any {
        return this._ctx.request.body;
    }

    public set body(value: any) {
        this._ctx.body = value;
    }

    public get statusCode(): number {
        return this._ctx.status;
    }

    public set statusCode(value: number) {
        this._ctx.status = value;
    }

    public get cookies(): Cookies {
        return this._ctx.cookies;
    }

    public get ip(): string {
        return this._ctx.ip;
    }

    public get ips(): string[] {
        return this._ctx.ips;
    }

    public get host(): string {
        return this._ctx.host;
    }

    public get protocol(): string {
        return this._ctx.protocol;
    }

    public get path(): string {
        return this._ctx.path;
    }

    public get hostname(): string {
        return this._ctx.hostname;
    }

    public get originalUrl(): string {
        return this._ctx.originalUrl;
    }

    public json(data: any): KoaContext<T> {
        this._ctx.body = data;
        return this;
    }

    public redirect(url: string, alt?: string): void {
        this._ctx.redirect(url, alt);
    }
}

class KoaRouter<T> extends Router<KoaContext<T>, T> {

    private _app: Koa;

    private _router: KoaRouterRaw;

    public get proxy(): boolean {
        return this._app.proxy;
    }

    public set proxy(value: boolean) {
        this._app.proxy = value;
    }

    constructor(app: Koa, prefix?: string, isDefault: boolean = true, container?: Container) {
        super(prefix, isDefault, container);
        this._app = app;
        this._app.use(bodyParser());

        this._router = new KoaRouterRaw();
        this._app.use(this._router.routes());
        this._app.use(this._router.allowedMethods());
    }

    public onUse(handler: RouterMiddleware<KoaContext<T>, T>): void {
        this._router.use(async (ctx, next) => {
            await handler(new KoaContext<T>(ctx), next);
        });
    }

    public onRoute(method: HttpMethod, path: string | RegExp, middlewares: RouterMiddleware<KoaContext<T>, T>[], handler: RouterHandler<KoaContext<T>, T>): void {
        const fn = (this._router as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            const handlers: ((ctx: Koa.Context, next: INextFunction) => Promise<any>)[] = [];
            for (const middleware of middlewares) {
                handlers.push(async (ctx: Koa.Context, next: INextFunction) => {
                    await middleware(new KoaContext<T>(ctx, next), next);
                });
            }
            handlers.push(async (ctx: Koa.Context, next: INextFunction) => {
                const context = new KoaContext<T>(ctx, next);
                const data = await handler(context);
                ctx.body = {
                    oid: context.oid,
                    code: WTCode.ok,
                    data: data
                };
                // in koa we MUST invoke `await next()` regardless if multiple handlers registered
                await next();
            });
            fn.call(this._router, path, ...handlers);
        }
        else {
            throw new Error(`Koa does not support method "${method}"`);
        }
    }

}

export { KoaRouter, KoaContext };