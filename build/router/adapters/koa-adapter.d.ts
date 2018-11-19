/// <reference types="koa-router" />
/// <reference types="node" />
/// <reference types="koa-bodyparser" />
import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler, INextFunction } from "../router";
import Koa from "koa";
import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "../../constants";
import { IContainer } from "../../container";
declare class KoaContext<T> extends Context<T> {
    private _ctx;
    constructor(ctx: Koa.Context, next?: INextFunction);
    readonly headers: IncomingHttpHeaders;
    readonly query: any;
    readonly params: any;
    body: any;
    statusCode: number;
    cookie(name: string): string;
    json(data: any): KoaContext<T>;
}
declare class KoaRouter<T> extends Router<KoaContext<T>, T> {
    private _app;
    private _router;
    proxy: boolean;
    constructor(app: Koa, prefix?: string, isDefault?: boolean, container?: IContainer);
    onUse(handler: RouterMiddleware<KoaContext<T>, T>): void;
    onRoute(method: HttpMethod, path: string | RegExp, ...handlers: RouterHandler<KoaContext<T>, T>[]): void;
}
export { KoaRouter, KoaContext };
