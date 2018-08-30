"use strict";
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
const _ = __importStar(require("../../utilities"));
const uuid = __importStar(require("node-uuid"));
class ExpressContext extends context_1.Context {
    constructor(request, response, next) {
        super(_.assign({}, request.state), request, response, (error) => {
            if (next) {
                return new Promise((resolve, reject) => {
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
            return oid;
        });
    }
    async json(data) {
        const res = this.response;
        await res.json(data);
    }
}
exports.ExpressContext = ExpressContext;
class ExpressRouter extends router_1.Router {
    constructor(app, prefix) {
        super(prefix);
        this._app = app;
    }
    onUse(handler) {
        this._app.use(_.asyncify((req, res, next) => {
            handler(new ExpressContext(req, res, next));
        }));
    }
    onRoute(method, path, handler) {
        const fn = this._app[method.toLowerCase()];
        if (_.isFunction(fn)) {
            fn.call(this._app, path, _.asyncify((req, res) => {
                handler(new ExpressContext(req, res));
            }));
        }
        else {
            throw new Error(`Express does not support method "${method}"`);
        }
    }
}
exports.ExpressRouter = ExpressRouter;
//# sourceMappingURL=express-adapter.js.map