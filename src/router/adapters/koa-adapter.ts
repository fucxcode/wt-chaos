import { RouterContext } from "../router-context";
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
import { RouterContextHandler, RouterRequestHandler } from "../router-handler";
import { OperationContext } from "../operation-context";
import { RouterRequestConstructor } from "../request/router-request-ctor";
import { RouterRequest } from "../request/router-request";
import { fulfillRouterRequestProperties } from "../request/fulfill-properties";
import { validateRouterRequest } from "../request/validate-properties";

class KoaContext<T extends OperationContext> extends RouterContext<T> {

    private _ctx: Koa.Context;

    public get operationContext(): T {
        return this._ctx.state;
    }

    constructor(ctx: Koa.Context, next?: INextFunction) {
        super(ctx.req, ctx.res);

        this._ctx = ctx;
        this._ctx.state = {
            oid: uuid.v4(),
            path: this._ctx.path
        };
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

    public get requestBody(): any {
        return this._ctx.request.body;
    }

    public get responseBody(): any {
        return this._ctx.response.body;
    }

    public set responseBody(value: any) {
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

    public static toRouterMiddleware<T extends OperationContext>(middleware: Koa.Middleware): RouterMiddleware<KoaContext<T>, T> {
        return async function (ctx: KoaContext<T>, next: INextFunction): Promise<void> {
            await middleware(ctx._ctx, next);
        };
    }

    public get method(): HttpMethod {
        return this._ctx.method as HttpMethod;
    }

}

class KoaRouter<T extends OperationContext> extends Router<KoaContext<T>, T> {

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

    public onRoute(method: HttpMethod, path: string | RegExp, middlewares: RouterMiddleware<KoaContext<T>, T>[], handler: RouterContextHandler<KoaContext<T>, T> | RouterRequestHandler<T>, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>): void {
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
                let data: any;
                if (RouterRequestConstructor) {
                    const h = handler as RouterRequestHandler<T>;
                    const req = new RouterRequestConstructor();
                    // fulfill properties based on `@resolve` decorators
                    fulfillRouterRequestProperties(req, context);
                    // validate properties based on `@validate` decorators
                    await validateRouterRequest(req, context);
                    data = await h(req);
                }
                else {
                    const h = handler as RouterContextHandler<KoaContext<T>, T>;
                    data = await h(context);
                }
                ctx.body = {
                    oid: context.operationContext.oid,
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