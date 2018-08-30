import { Context } from "../context";
import { Router, RouterMiddleware, RouterHandler } from "../router";
import * as express from "express";
import * as _ from "../../utilities";
import * as uuid from "node-uuid";

interface ExpressRequest extends express.Request {

    oid?: string;

    state?: any;

}

class ExpressContext<T> extends Context<T> {

    constructor(request: ExpressRequest, response: express.Response, next?: express.NextFunction) {
        super(_.assign({}, request.state), request, response, (error?: any) => {
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
            let oid = request.oid;
            if (_.isNilOrWriteSpaces(oid)) {
                oid = uuid.v4();
                request.oid = oid;
            }
            return oid as string;
        });
    }

    public async json(data: any): Promise<void> {
        const res = this.response as express.Response;
        await res.json(data);
    }

}

class ExpressRouter<T> extends Router<ExpressContext<T>, T> {

    private _app: express.Express;

    constructor(app: express.Express, prefix?: string) {
        super(prefix);
        this._app = app;
    }

    public onUse(handler: RouterMiddleware<ExpressContext<T>, T>): void {
        this._app.use(_.asyncify((req, res, next) => {
            handler(new ExpressContext<T>(req, res, next));
        }));
    }

    public onRoute(method: string, path: string | RegExp, handler: RouterHandler<ExpressContext<T>, T>): void {
        const fn = (this._app as any)[method.toLowerCase()] as Function;
        if (_.isFunction(fn)) {
            fn.call(this._app, path, _.asyncify((req: ExpressRequest, res: express.Response) => {
                handler(new ExpressContext<T>(req, res));
            }));
        }
        else {
            throw new Error(`Express does not support method "${method}"`);
        }
    }

}

export { ExpressContext, ExpressRouter };