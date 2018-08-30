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
    constructor(stateResolver, request, response, next, oidResolver = uuid.v4) {
        this._oid = oidResolver();
        this._state = stateResolver();
        this._request = request;
        this._response = response;
        this._next = next;
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
    get next() {
        return this._next || Promise.resolve;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map