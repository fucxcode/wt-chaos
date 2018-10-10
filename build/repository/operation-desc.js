"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(oid, team, uid, path) {
        this._oid = oid;
        this._team = team;
        this._uid = uid;
        this._path = path;
    }
}
exports.OperationDescription = OperationDescription;
//# sourceMappingURL=operation-desc.js.map