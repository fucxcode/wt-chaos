/// <reference types="node" />
import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler } from "../router";
import * as express from "express";
import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "../../constants";
import { Container } from "../../container";
import { Cookies } from "../cookies";
interface ExpressRequest extends express.Request {
    oid?: string;
    state?: any;
}
declare class ExpressContext<T> extends Context<T> {
    private _req;
    private _res;
    constructor(request: ExpressRequest, response: express.Response);
    readonly headers: IncomingHttpHeaders;
    readonly query: any;
    readonly params: any;
    body: any;
    statusCode: number;
    readonly cookies: Cookies;
    readonly ip: string;
    readonly ips: string[];
    readonly host: string;
    readonly protocol: string;
    readonly path: string;
    readonly hostname: string;
    readonly originalUrl: string;
    json(data: any): ExpressContext<T>;
    redirect(url: string, alt?: string): void;
}
declare class ExpressRouter<T> extends Router<ExpressContext<T>, T> {
    private _app;
    proxy: boolean;
    constructor(app: express.Express, prefix?: string, isDefault?: boolean, container?: Container);
    onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void;
    onRoute(method: HttpMethod, path: string | RegExp, middlewares: RouterMiddleware<ExpressContext<T>, T>[], handler: RouterHandler<ExpressContext<T>, T>): void;
}
export { ExpressContext, ExpressRouter };
