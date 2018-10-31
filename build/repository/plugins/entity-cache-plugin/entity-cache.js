"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../../../utilities"));
const entity_cache_hit_ratio_listener_1 = require("./entity-cache-hit-ratio-listener");
const serializer_1 = require("../../../serializer");
class DefaultRandomizer {
    random(lower, upper, floating) {
        return _.random(lower, upper, floating);
    }
}
exports.DefaultRandomizer = DefaultRandomizer;
class EntityCache {
    get cache() {
        return this._cache;
    }
    constructor(cache, prefix = "", serializer = new serializer_1.BSONSerializer(), randomizer = new DefaultRandomizer(), jitterInMilliseconds = 50, listener = new entity_cache_hit_ratio_listener_1.EmptyEntityCacheHitRatioListener()) {
        this._cache = cache;
        this._prefix = prefix;
        this._serializer = serializer;
        this._randomizer = randomizer;
        this._jitter = jitterInMilliseconds;
        this._hitRatioListener = listener;
    }
    generateKeyString(key) {
        return key.toString(this._prefix);
    }
    generateExpirationWithJitter(expires) {
        return expires ? (expires + this._randomizer.random(0, this._jitter, false)) : 0;
    }
    async getByKey(key, expireInMilliseconds) {
        const keyString = this.generateKeyString(key);
        const buffer = await this._cache.getBuffer(keyString);
        if (_.isEmpty(buffer)) {
            await this._hitRatioListener.miss(key);
        }
        else {
            await this._hitRatioListener.bingo(key);
            if (expireInMilliseconds) {
                await this._cache.pexpire(keyString, this.generateExpirationWithJitter(expireInMilliseconds));
            }
            return this._serializer.deserialize(buffer);
        }
    }
    async onGetByKeys(keys, expire) {
        const keysString = _.map(keys, x => this.generateKeyString(x));
        const buffers = await this._cache.mgetBuffer(...keysString);
        if (expire) {
            const multi = this._cache.multi();
            for (const keyString of keysString) {
                multi.pexpire(keyString, expire);
            }
            await multi.exec();
        }
        return buffers;
    }
    async getByKeys(keys, expireInMilliseconds) {
        if (_.some(keys)) {
            const expire = this.generateExpirationWithJitter(expireInMilliseconds);
            const buffers = await this.onGetByKeys(keys, expire);
            const records = [];
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const result = buffers[i];
                records.push(new entity_cache_hit_ratio_listener_1.EntityCacheHitRatioRecord(key, !!result));
            }
            await this._hitRatioListener.trackMultiple(records);
            return _.chain(buffers)
                .filter(x => !_.isEmpty(x))
                .map(x => this._serializer.deserialize(x))
                .valueOf();
        }
        else {
            return [];
        }
    }
    async setByEntity(entity, keyResolver, expireInMilliseconds) {
        const key = keyResolver(entity);
        const keyString = this.generateKeyString(key);
        const value = this._serializer.serialize(entity);
        if (expireInMilliseconds) {
            const expire = this.generateExpirationWithJitter(expireInMilliseconds);
            await this._cache.psetex(keyString, expire, value);
        }
        else {
            await this._cache.set(keyString, value);
        }
        return key;
    }
    async onSetByEntities(items, setExpiration) {
        const keyValuePairs = [];
        for (const item of items) {
            keyValuePairs.push([item.key, item.value]);
        }
        if (setExpiration) {
            const multi = this._cache.multi();
            multi.mset(...keyValuePairs);
            for (const item of items) {
                multi.pexpire(item.key, item.expire);
            }
            await multi.exec();
        }
        else {
            await this._cache.mset(...keyValuePairs);
        }
    }
    async setByEntities(entities, keyResolver, expireInMilliseconds) {
        const keys = [];
        if (_.some(entities)) {
            const items = _.map(entities, entity => {
                const key = keyResolver(entity);
                keys.push(key);
                return {
                    key: this.generateKeyString(key),
                    value: this._serializer.serialize(entity),
                    expire: this.generateExpirationWithJitter(expireInMilliseconds)
                };
            });
            await this.onSetByEntities(items, !!expireInMilliseconds);
        }
        return keys;
    }
    async deleteByKey(key) {
        await this._cache.del(this.generateKeyString(key));
    }
    async deleteByKeys(keys) {
        await this._cache.del(..._.map(keys, x => this.generateKeyString(x)));
    }
    deleteByPattern(pattern) {
        return new Promise((resolve, reject) => {
            const keys = [];
            const stream = this._cache.scanStream({
                match: this.generateKeyString(pattern)
            });
            stream.on("data", data => {
                for (const key of data) {
                    keys.push(key);
                }
            });
            stream.on("error", error => {
                return reject(error);
            });
            stream.on("end", () => {
                if (_.some(keys)) {
                    this._cache.del(...keys);
                }
                return resolve();
            });
        });
    }
    async clear() {
        await this._cache.clear();
    }
}
exports.EntityCache = EntityCache;
//# sourceMappingURL=entity-cache.js.map