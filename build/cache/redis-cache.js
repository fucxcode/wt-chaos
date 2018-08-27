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
const serializer_1 = require("../serializer");
const hit_ratio_analytics_1 = require("./hit-ratio-analytics");
class DefaultRandomizer {
    random(lower, upper, floating) {
        return _.random(lower, upper, floating);
    }
}
exports.DefaultRandomizer = DefaultRandomizer;
class RedisCache {
    get redis() {
        return this._redis;
    }
    constructor(redis, prefix = "", serializer = new serializer_1.BSONSerializer(), randomizer = new DefaultRandomizer(), jitterInMilliseconds = 50, cacheHitRetionAnalyticsOptions) {
        this._redis = redis;
        this._prefix = prefix;
        this._serializer = serializer;
        this._randomizer = randomizer;
        this._jitter = jitterInMilliseconds;
        if (cacheHitRetionAnalyticsOptions) {
            this._hitRatioAnalytics = new hit_ratio_analytics_1.CacheHitRatioAnalytics(cacheHitRetionAnalyticsOptions);
        }
    }
    generateKeyString(key) {
        return key.toString(this._prefix);
    }
    generateExpirationWithJitter(expires) {
        return expires ? (expires + this._randomizer.random(0, this._jitter, false)) : 0;
    }
    async getByKey(key, expireInMilliseconds) {
        const keyString = this.generateKeyString(key);
        const buffer = await this._redis.getBuffer(keyString);
        if (_.isEmpty(buffer)) {
            await this._hitRatioAnalytics && this._hitRatioAnalytics.miss(key);
        }
        else {
            await this._hitRatioAnalytics && this._hitRatioAnalytics.bingo(key);
            if (expireInMilliseconds) {
                await this._redis.pexpire(keyString, this.generateExpirationWithJitter(expireInMilliseconds));
            }
            return this._serializer.deserialize(buffer);
        }
    }
    async onGetByKeys(keys, expire) {
        const keysString = _.map(keys, x => this.generateKeyString(x));
        const buffers = await this._redis.mgetBuffer(...keysString);
        if (expire) {
            const multi = this._redis.multi();
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
                records.push(new hit_ratio_analytics_1.CacheHitRatioRecord(key, !!result));
            }
            await this._hitRatioAnalytics && this._hitRatioAnalytics.trackMultiple(records);
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
            await this._redis.psetex(keyString, expire, value);
        }
        else {
            await this._redis.set(keyString, value);
        }
        return key;
    }
    async onSetByEntities(items, setExpiration) {
        const keyValuePairs = [];
        for (const item of items) {
            keyValuePairs.push([item.key, item.value]);
        }
        if (setExpiration) {
            const multi = this._redis.multi();
            multi.mset(...keyValuePairs);
            for (const item of items) {
                multi.pexpire(item.key, item.expire);
            }
            await multi.exec();
        }
        else {
            await this._redis.mset(...keyValuePairs);
        }
        // const firstKey = _.first(items).key;
        // const firstValue = _.first(items).value;
        // const restKeyValueArray = _.chain(items).tail().map(x => [x.key, x.value]).flatten().valueOf();
        // if (setExpiration) {
        //     const multi = this._redis.multi();
        //     (multi as any).mset(firstKey, firstValue, ...restKeyValueArray);
        //     for (const item of items) {
        //         multi.pexpire(item.key, item.expire);
        //     }
        //     await multi.exec();
        // }
        // else {
        //     await (this._redis as any).mset(firstKey, firstValue, ...restKeyValueArray);
        // }
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
        await this._redis.del(this.generateKeyString(key));
    }
    async deleteByKeys(keys) {
        await this._redis.del(..._.map(keys, x => this.generateKeyString(x)));
    }
    deleteByPattern(pattern) {
        return new Promise((resolve, reject) => {
            const keys = [];
            const stream = this._redis.scanStream({
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
                    this._redis.del(...keys);
                }
                return resolve();
            });
        });
    }
    async clear() {
        await this._redis.clear();
    }
}
exports.RedisCache = RedisCache;
