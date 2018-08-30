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
class Router {
    constructor(prefix = "") {
        this._prefix = prefix;
    }
    get prefix() {
        return this._prefix;
    }
    use(handler) {
        this.onUse(handler);
    }
    route(method, path, ...handlers) {
        this.onRoute(method, $path.join(this._prefix, path), ...handlers);
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map