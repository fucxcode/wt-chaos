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
class KoaContext extends context_1.Context {
    constructor(ctx, next) {
        super(ctx.state, ctx.req, ctx.res, next, () => {
            let oid = ctx.state.oid;
            if (_.isNilOrWriteSpaces(oid)) {
                oid = uuid.v4();
                ctx.state.oid = oid;
            }
            return oid;
        });
        this._ctx = ctx;
    }
    async json(data) {
        this._ctx.body = data;
    }
}
exports.KoaContext = KoaContext;
class KoaRouter extends router_1.Router {
    constructor(app, prefix) {
        super(prefix);
        this._app = app;
        this._router = new koa_router_1.default();
        this._app.use(this._router.routes());
        this._app.use(this._router.allowedMethods());
    }
    onUse(handler) {
        this._router.use(async (ctx, next) => {
            await handler(new KoaContext(ctx, next));
        });
    }
    onRoute(method, path, handler) {
        const fn = this._router[method.toLowerCase()];
        if (_.isFunction(fn)) {
            fn.call(this._router, path, async (ctx) => {
                await handler(new KoaContext(ctx));
            });
        }
        else {
            throw new Error(`Koa does not support method "${method}"`);
        }
    }
}
exports.KoaRouter = KoaRouter;
//# sourceMappingURL=koa-adapter.js.map