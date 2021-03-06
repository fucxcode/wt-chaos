import { RouterContext } from "../router-context";
import { Router } from "../router";
import * as express from "express";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";
import { IncomingHttpHeaders } from "http";
import bodyParser from "body-parser";
import { HttpMethod } from "../../constants";
import { Container } from "../../container";
import { Cookies, GetOption, SetOption } from "../cookies";
import { RouterMiddleware } from "../router-middleware";
import { RouterContextHandler } from "../router-handler";
import { OperationContext } from "../operation-context";

interface ExpressRequest extends express.Request {

    oid?: string;

    state?: any;

}

class ExpressCookies implements Cookies {

    private _req: ExpressRequest;

    private _res: express.Response;

    constructor(req: ExpressRequest, res: express.Response) {
        this._req = req;
        this._res = res;
    }

    public get secure(): boolean {
        throw new Error("not implements");
    }

    public get(name: string, opts?: GetOption): string {
        return this._req.cookies[name];
    }

    public set(name: string, value?: string, opts?: SetOption): Cookies {
        this._res.cookie(name, value, opts || {});
        return this;
    }

}

class ExpressContext<T extends OperationContext> extends RouterContext<T> {

    private _req: ExpressRequest;

    private _res: express.Response;

    private _operationContext: T;

    public get operationContext(): T {
        return this._operationContext;
    }

    constructor(request: ExpressRequest, response: express.Response) {
        super(request, response);
        this._req = request;
        this._res = response;
        this._operationContext = {
            oid: uuid.v4(),
            path: this._req.path
        } as any;
    }

    public get headers(): IncomingHttpHeaders {
        return this._req.headers;
    }

    public get query(): any {
        return this._req.query;
    }

    public get params(): any {
        return this._req.params;
    }

    public get requestBody(): any {
        return this._req.body;
    }

    public get responseBody(): any {
        throw new Error("not implements");
    }

    public set responseBody(value: any) {
        this._res.send(value);
    }

    public get statusCode(): number {
        return this._res.statusCode;
    }

    public set statusCode(value: number) {
        this._res.status(value);
    }

    public get cookies(): Cookies {
        return new ExpressCookies(this._req, this._res);
    }

    public get ip(): string {
        return this._req.ip;
    }

    public get ips(): string[] {
        return this._req.ips;
    }

    public get host(): string {
        return this._req.host;
    }

    public get protocol(): string {
        return this._req.protocol;
    }

    public get path(): string {
        return this._req.path;
    }

    public get hostname(): string {
        return this._req.hostname;
    }

    public get originalUrl(): string {
        return this._req.originalUrl;
    }

    public json(data: any): ExpressContext<T> {
        this._res.json(data);
        return this;
    }

    public redirect(url: string, alt?: string): void {
        this._res.redirect(url);
    }

    public get method(): HttpMethod {
        return this._req.method as HttpMethod;
    }

}

class ExpressRouter<T extends OperationContext> extends Router<ExpressContext<T>, T> {

    private _app: express.Express;

    public get proxy(): boolean {
        return this._app.enabled("trust proxy");
    }

    public set proxy(value: boolean) {
        if (value) {
            this._app.enable("trust proxy");
        }
        else {
            this._app.disable("trust proxy");
        }
    }

    constructor(app: express.Express, prefix?: string, isDefault: boolean = true, container?: Container) {
        super(prefix, isDefault, container);
        this._app = app;
        this._app.use(bodyParser.urlencoded({
            extended: false
        }));
        this._app.use(bodyParser.json());
    }

    public onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void {
        this._app.use(_.asyncify((req, res, next) => {
            handler(new ExpressContext<T>(req, res), next);
        }));
    }

    public onRoute(method: HttpMethod, path: string | RegExp, middlewares: RouterMiddleware<ExpressContext<T>, T>[], handler: RouterContextHandler<ExpressContext<T>, T>): void {
        const fn = (this._app as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            const handlers: ((req: ExpressRequest, res: express.Response, next: express.NextFunction) => void)[] = [];
            for (const middleware of middlewares) {
                handlers.push((req: ExpressRequest, res: express.Response, next: express.NextFunction) => {
                    const c = new ExpressContext<T>(req, res);
                    const n = (error?: any) => {
                        if (next) {
                            return new Promise<void>((resolve, reject) => {
                                if (error) {
                                    return reject(error);
                                }
                                else {
                                    res.on("finish", () => {
                                        return resolve();
                                    });
                                    return next();
                                }
                            });
                        }
                        else {
                            return Promise.resolve();
                        }
                    };
                    Promise.resolve(middleware(c, n)).then(() => {
                        next();
                    }).catch(error => {
                        next(error);
                    });
                });
                handlers.push((req: ExpressRequest, res: express.Response, next: express.NextFunction) => {
                    Promise.resolve(handler(new ExpressContext<T>(req, res))).then(() => {
                        next();
                    }).catch(error => {
                        next(error);
                    });
                });
            }
            fn.call(this._app, path, ...handlers);
        }
        else {
            throw new Error(`Express does not support method "${method}"`);
        }
    }

}

export { ExpressContext, ExpressRouter };