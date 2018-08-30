import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler } from "../router";
import * as express from "express";
interface ExpressRequest extends express.Request {
    oid?: string;
    state?: any;
}
declare class ExpressContext<T> extends Context<T> {
    private _req;
    private _res;
    constructor(request: ExpressRequest, response: express.Response, next?: express.NextFunction);
    json(data: any): ExpressContext<T>;
}
declare class ExpressRouter<T> extends Router<ExpressContext<T>, T> {
    private _app;
    constructor(app: express.Express, prefix?: string);
    onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void;
    onRoute(method: string, path: string | RegExp, ...handlers: RouterHandler<ExpressContext<T>, T>[]): void;
}
export { ExpressContext, ExpressRouter };
