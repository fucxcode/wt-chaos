"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
const router_1 = require("../router");
const koa_router_1 = __importDefault(require("koa-router"));
const _ = __importStar(require("../../utilities"));
const uuid = __importStar(require("node-uuid"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
class KoaContext extends context_1.Context {
    constructor(ctx, next) {
        super(() => ctx.state, ctx.req, ctx.res, next, () => {
            if (!ctx.state.oid) {
                ctx.state.oid = uuid.v4();
            }
            return ctx.state.oid;
        });
        this._ctx = ctx;
    }
    get headers() {
        return this._ctx.headers;
    }
    get query() {
        return this._ctx.query;
    }
    get params() {
        return this._ctx.params;
    }
    get body() {
        return this._ctx.request.body;
    }
    set body(value) {
        this._ctx.body = value;
    }
    get statusCode() {
        return this._ctx.status;
    }
    set statusCode(value) {
        this._ctx.status = value;
    }
    json(data) {
        this._ctx.body = data;
        return this;
    }
}
exports.KoaContext = KoaContext;
class KoaRouter extends router_1.Router {
    constructor(app, prefix) {
        super(prefix);
        this._app = app;
        this._app.use(koa_bodyparser_1.default());
        this._router = new koa_router_1.default();
        this._app.use(this._router.routes());
        this._app.use(this._router.allowedMethods());
    }
    get proxy() {
        return this._app.proxy;
    }
    set proxy(value) {
        this._app.proxy = value;
    }
    onUse(handler) {
        this._router.use(async (ctx, next) => {
            await handler(new KoaContext(ctx, next));
        });
    }
    onRoute(method, path, ...handlers) {
        const fn = this._router[method.toLowerCase()];
        if (_.isFunction(fn)) {
            fn.call(this._router, path, ..._.map(handlers, handler => {
                return async (ctx, next) => {
                    await handler(new KoaContext(ctx, next));
                    // in koa we MUST invoke `await next()` regardless if multiple handlers registered
                    await next();
                };
            }));
        }
        else {
            throw new Error(`Koa does not support method "${method}"`);
        }
    }
}
exports.KoaRouter = KoaRouter;
//# sourceMappingURL=koa-adapter.js.map