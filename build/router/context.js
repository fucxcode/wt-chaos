"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("node-uuid"));
class Context {
    constructor(stateResolver, request, response, oidResolver = uuid.v4) {
        this._oid = oidResolver();
        this._state = stateResolver();
        this._request = request;
        this._response = response;
    }
    get oid() {
        return this._oid;
    }
    get state() {
        return this._state;
    }
    get request() {
        return this._request;
    }
    get response() {
        return this._response;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map