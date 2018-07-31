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
class InProcessCache {
    get map() {
        return this._map;
    }
    constructor(prefix) {
        this._prefix = prefix;
        this._map = new Map();
    }
    async getByKey(key, expireInMilliseconds) {
        return this._map.get(key.toString(this._prefix));
    }
    async getByKeys(keys, expireInMilliseconds) {
        return _.chain(keys).map(x => this._map.get(x.toString(this._prefix))).filter(x => !_.isEmpty(x)).valueOf();
    }
    async setByEntity(entity, keyResolver, expireInMilliseconds) {
        const key = keyResolver(entity);
        this._map.set(key.toString(this._prefix), entity);
        return key;
    }
    async setByEntities(entities, keyResolver, expireInMilliseconds) {
        const keys = [];
        for (const entity of entities) {
            const key = keyResolver(entity);
            this._map.set(key.toString(this._prefix), entity);
            keys.push(key);
        }
        return keys;
    }
    async deleteByKey(key) {
        this._map.delete(key.toString(this._prefix));
    }
    async deleteByKeys(keys) {
        for (const key of keys) {
            this._map.delete(key.toString(this._prefix));
        }
    }
    async deleteByPattern(pattern) {
        const patternValue = pattern.toPattern().split(`*`).join(``);
        for (const key of this._map.keys()) {
            if (key.startsWith(patternValue)) {
                this._map.delete(key);
            }
        }
    }
    async clear() {
        this._map.clear();
    }
}
exports.default = InProcessCache;
//# sourceMappingURL=in-process-cache.js.map