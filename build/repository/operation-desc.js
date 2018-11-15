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
class OperationDescription {
    get oid() {
        return this._oid;
    }
    get team() {
        return this._team;
    }
    get uid() {
        return this._uid;
    }
    get path() {
        return this._path;
    }
    constructor(oid = uuid.v4(), team, uid, path) {
        this._oid = oid;
        this._team = team;
        this._uid = uid;
        this._path = path;
    }
}
exports.OperationDescription = OperationDescription;
//# sourceMappingURL=operation-desc.js.map