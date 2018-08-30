/// <reference types="koa-router" />
import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler, INextFunction } from "../router";
import Koa from "koa";
declare class KoaContext<T> extends Context<T> {
    private _ctx;
    constructor(ctx: Koa.Context, next?: INextFunction);
    json(data: any): KoaContext<T>;
}
declare class KoaRouter<T> extends Router<KoaContext<T>, T> {
    private _app;
    private _router;
    constructor(app: Koa, prefix?: string);
    onUse(handler: RouterMiddleware<KoaContext<T>, T>): void;
    onRoute(method: string, path: string | RegExp, ...handlers: RouterHandler<KoaContext<T>, T>[]): void;
}
export { KoaRouter, KoaContext };
