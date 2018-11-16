/// <reference types="node" />
import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler } from "../router";
import * as express from "express";
import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "../../constants";
interface ExpressRequest extends express.Request {
    oid?: string;
    state?: any;
}
declare class ExpressContext<T> extends Context<T> {
    private _req;
    private _res;
    constructor(request: ExpressRequest, response: express.Response, next?: express.NextFunction);
    readonly headers: IncomingHttpHeaders;
    readonly query: any;
    readonly params: any;
    body: any;
    json(data: any): ExpressContext<T>;
}
declare class ExpressRouter<T> extends Router<ExpressContext<T>, T> {
    private _app;
    proxy: boolean;
    constructor(app: express.Express, prefix?: string);
    onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void;
    onRoute(method: HttpMethod, path: string | RegExp, ...handlers: RouterHandler<ExpressContext<T>, T>[]): void;
}
export { ExpressContext, ExpressRouter };
