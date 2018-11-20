"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const $path = __importStar(require("path"));
const container_1 = require("../container");
const DEFAULT_ROUTER_KEY = Symbol.for("default_router");
exports.DEFAULT_ROUTER_KEY = DEFAULT_ROUTER_KEY;
class Router {
    constructor(prefix = "", isDefault = true, container) {
        this._prefix = prefix;
        if (isDefault) {
            this.setDefault(container);
        }
    }
    get prefix() {
        return this._prefix;
    }
    use(handler) {
        this.onUse(handler);
    }
    route(method, path, middlewares, handler) {
        this.onRoute(method, $path.join(this._prefix, path), middlewares, handler);
    }
    setDefault(container = container_1.ContainerPool.getDefaultContainer()) {
        if (container) {
            const c = container;
            c.registerInstance(DEFAULT_ROUTER_KEY, this);
        }
        else {
            throw new Error("cannot specify default router without default container");
        }
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map