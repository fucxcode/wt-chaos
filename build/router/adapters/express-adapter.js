"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
const router_1 = require("../router");
const _ = __importStar(require("../../utilities"));
const uuid = __importStar(require("node-uuid"));
const body_parser_1 = __importDefault(require("body-parser"));
class ExpressCookies {
    constructor(req, res) {
        this._req = req;
        this._res = res;
    }
    get secure() {
        throw new Error("not implements");
    }
    get(name, opts) {
        return this._req.cookies[name];
    }
    set(name, value, opts) {
        this._res.cookie(name, value, opts || {});
        return this;
    }
}
class ExpressContext extends context_1.Context {
    constructor(request, response) {
        super(() => {
            if (!request.state) {
                request.state = {};
            }
            return request.state;
        }, request, response, () => {
            if (!request.oid) {
                request.oid = uuid.v4();
            }
            return request.oid;
        });
        this._req = request;
        this._res = response;
    }
    get headers() {
        return this._req.headers;
    }
    get query() {
        return this._req.query;
    }
    get params() {
        return this._req.params;
    }
    get body() {
        return this._req.body;
    }
    set body(value) {
        this._res.send(value);
    }
    get statusCode() {
        return this._res.statusCode;
    }
    set statusCode(value) {
        this._res.status(value);
    }
    get cookies() {
        return new ExpressCookies(this._req, this._res);
    }
    get ip() {
        return this._req.ip;
    }
    get ips() {
        return this._req.ips;
    }
    get host() {
        return this._req.host;
    }
    get protocol() {
        return this._req.protocol;
    }
    get path() {
        return this._req.path;
    }
    get hostname() {
        return this._req.hostname;
    }
    get originalUrl() {
        return this._req.originalUrl;
    }
    json(data) {
        this._res.json(data);
        return this;
    }
    redirect(url, alt) {
        this._res.redirect(url);
    }
}
exports.ExpressContext = ExpressContext;
class ExpressRouter extends router_1.Router {
    constructor(app, prefix, isDefault = true, container) {
        super(prefix, isDefault, container);
        this._app = app;
        this._app.use(body_parser_1.default.urlencoded({
            extended: false
        }));
        this._app.use(body_parser_1.default.json());
    }
    get proxy() {
        return this._app.enabled("trust proxy");
    }
    set proxy(value) {
        if (value) {
            this._app.enable("trust proxy");
        }
        else {
            this._app.disable("trust proxy");
        }
    }
    onUse(handler) {
        this._app.use(_.asyncify((req, res, next) => {
            handler(new ExpressContext(req, res), next);
        }));
    }
    onRoute(method, path, middlewares, handler) {
        const fn = this._app[method.toLowerCase()];
        if (_.isFunction(fn)) {
            const handlers = [];
            for (const middleware of middlewares) {
                handlers.push((req, res, next) => {
                    const c = new ExpressContext(req, res);
                    const n = (error) => {
                        if (next) {
                            return new Promise((resolve, reject) => {
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
                handlers.push((req, res, next) => {
                    Promise.resolve(handler(new ExpressContext(req, res))).then(() => {
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
exports.ExpressRouter = ExpressRouter;
//# sourceMappingURL=express-adapter.js.map