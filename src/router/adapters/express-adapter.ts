import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler } from "../router";
import * as express from "express";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";
import { IncomingHttpHeaders } from "http";
import bodyParser from "body-parser";
import { HttpMethod } from "../../constants";
import { WTCode } from "../..";

interface ExpressRequest extends express.Request {

    oid?: string;

    state?: any;

}

class ExpressContext<T> extends Context<T> {

    private _req: ExpressRequest;

    private _res: express.Response;

    constructor(request: ExpressRequest, response: express.Response, next?: express.NextFunction) {
        super(() => {
            if (!request.state) {
                request.state = {};
            }
            return request.state;
        }, request, response, (error?: any) => {
            if (next) {
                return new Promise<void>((resolve, reject) => {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        response.on("finish", () => {
                            return resolve();
                        });
                        return next();
                    }
                });
            }
            else {
                return Promise.resolve();
            }
            // return Promise.resolve(next && next(error));
        }, () => {
            if (!request.oid) {
                request.oid = uuid.v4();
            }
            return request.oid;
        });
        this._req = request;
        this._res = response;
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

    public get body(): any {
        return this._req.body;
    }

    public set body(value: any) {
        this._res.send(value);
    }

    public get statusCode(): number {
        return this._res.statusCode;
    }

    public set statusCode(value: number) {
        this._res.status(value);
    }

    public cookie(name: string): string {
        return this._req.cookies[name];
    }
    
    public json(data: any): ExpressContext<T> {
        this._res.json(data);
        return this;
    }

}

class ExpressRouter<T> extends Router<ExpressContext<T>, T> {

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


    constructor(app: express.Express, prefix?: string) {
        super(prefix);
        this._app = app;
        this._app.use(bodyParser.urlencoded({
            extended: false
        }));
        this._app.use(bodyParser.json());
    }

    public onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void {
        this._app.use(_.asyncify((req, res, next) => {
            handler(new ExpressContext<T>(req, res, next));
        }));
    }

    public onRoute(method: HttpMethod, path: string | RegExp, ...handlers: RouterHandler<ExpressContext<T>, T>[]): void {
        const fn = (this._app as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            fn.call(this._app, path, ..._.map(handlers, handler => {
                return (req: ExpressRequest, res: express.Response, next: express.NextFunction) => {
                    const context = new ExpressContext<T>(req, res, next);
                    Promise.resolve(handler(context)).then(data => {
                        if (data && !res.finished) {
                            res.json({
                                oid: context.oid,
                                code: WTCode.ok,
                                data: data
                            });
                        }
                        next();
                    }).catch(error => {
                        next(error);
                    });
                };
            }));
        }
        else {
            throw new Error(`Express does not support method "${method}"`);
        }
    }

}

export { ExpressContext, ExpressRouter };