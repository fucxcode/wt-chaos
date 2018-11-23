"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///////////////////////////////////////////////////////////////////////////////
function defineProps(obj, key, value) {
    Object.defineProperty(obj, key, {
        value,
        configurable: true,
        enumerable: true
    });
}
class TEntry {
    constructor(data) {
        this._data = data || Object.create(null);
    }
    withField(key, value) {
        const obj = Object.create(null);
        defineProps(obj, key, value);
        return this.withFields(obj);
    }
    withFields(fields) {
        const data = Object.assign({}, this._data, fields);
        return new TEntry(data);
    }
    toJSON() {
        return this._data;
    }
}
exports.TEntry = TEntry;
//# sourceMappingURL=entity.js.map