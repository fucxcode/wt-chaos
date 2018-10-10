"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FindByPageNextResult {
    constructor(entities, pageIndex, pageSize, next) {
        this._entities = entities;
        this._pageIndex = pageIndex;
        this._pageSize = pageSize;
        this._next = next;
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
    get next() {
        return this._next;
    }
}
exports.FindByPageNextResult = FindByPageNextResult;
//# sourceMappingURL=find-by-page-next-result.js.map