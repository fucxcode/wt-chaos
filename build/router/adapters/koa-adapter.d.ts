/// <reference types="koa-router" />
/// <reference types="node" />
/// <reference types="koa-bodyparser" />
import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler, INextFunction } from "../router";
import Koa from "koa";
import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "../../constants";
import { Container } from "../../container";
import { Cookies } from "../cookies";
declare class KoaContext<T> extends Context<T> {
    private _ctx;
    readonly innerContext: Koa.Context;
    constructor(ctx: Koa.Context, next?: INextFunction);
    readonly headers: IncomingHttpHeaders;
    readonly query: any;
    readonly params: any;
    body: any;
    statusCode: number;
    readonly cookies: Cookies;
    readonly ip: string;
    readonly ips: string[];
    json(data: any): KoaContext<T>;
}
declare class KoaRouter<T> extends Router<KoaContext<T>, T> {
    private _app;
    private _router;
    proxy: boolean;
    constructor(app: Koa, prefix?: string, isDefault?: boolean, container?: Container);
    onUse(handler: RouterMiddleware<KoaContext<T>, T>): void;
    onRoute(method: HttpMethod, path: string | RegExp, ...handlers: RouterHandler<KoaContext<T>, T>[]): void;
}
export { KoaRouter, KoaContext };
