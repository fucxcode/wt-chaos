"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
class FindByPageIndexResult {
    constructor(entities, pageIndex, pageSize, count) {
        this._entities = entities;
        this._pageIndex = pageIndex;
        this._pageSize = pageSize;
        this._count = count;
        this._pageCount = _.ceil(this._count / this._pageSize);
    }
    get entities() {
        return this._entities;
    }
    get pageIndex() {
        return this._pageIndex;
    }
    get pageSize() {
        return this._pageSize;
    }
    get pageCount() {
        return this._pageCount;
    }
    get count() {
        return this._count;
    }
}
exports.FindByPageIndexResult = FindByPageIndexResult;
//# sourceMappingURL=find-by-page-index-result.js.map