"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
class RedisBase {
    get redis() {
        return this._redis;
    }
    constructor(redis) {
        this._redis = redis;
    }
    async ping() {
        return await this._redis.ping();
    }
    disconnect() {
        this._redis.disconnect();
    }
    async getBuffer(key) {
        return await this._redis.getBuffer(key);
    }
    async pexpire(key, milliseconds) {
        return await this._redis.pexpire(key, milliseconds);
    }
    async mgetBuffer(...keys) {
        return await this._redis.mgetBuffer(...keys);
    }
    async psetex(key, milliseconds, value) {
        return await this._redis.psetex(key, milliseconds, value);
    }
    async set(key, value, ...args) {
        return await this._redis.set(key, value, args);
    }
    async mset(...keyValuePairs) {
        const result = helper_1.CacheHelper.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            return await this._redis.mset(result.first["0"], result.first["1"], ...result.rest);
        }
        else {
            return "OK";
        }
    }
    async del(...keys) {
        return await this._redis.del(...keys);
    }
    scanStream(options) {
        return this._redis.scanStream(options);
    }
    static scanInternal(redis, options) {
        return new Promise((resolve, reject) => {
            const keys = [];
            const stream = redis.scanStream(options);
            stream.on("data", (data) => {
                for (const key of data) {
                    keys.push(key);
                }
            });
            stream.on("error", error => {
                return reject(error);
            });
            stream.on("end", () => {
                return resolve(keys);
            });
        });
    }
    async scan(options) {
        return RedisBase.scanInternal(this._redis, options);
    }
    static async clearInternal(redis) {
        return await redis.flushall();
    }
    async clear() {
        return await RedisBase.clearInternal(this._redis);
    }
    multi() {
        return new RedisPipeline(this._redis.multi());
    }
    async sadd(key, ...members) {
        return await this._redis.sadd(key, ...members);
    }
    async srem(key, ...members) {
        return await this._redis.srem(key, ...members);
    }
    async smembers(key) {
        return await this._redis.smembers(key);
    }
}
exports.RedisBase = RedisBase;
class RedisPipeline {
    constructor(multi) {
        this._multi = multi;
    }
    pexpire(key, milliseconds) {
        this._multi.pexpire(key, milliseconds);
    }
    mset(...keyValuePairs) {
        const result = helper_1.CacheHelper.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            this._multi.mset(result.first["0"], result.first["1"], ...result.rest);
        }
    }
    async exec() {
        return await this._multi.exec();
    }
}
exports.RedisPipeline = RedisPipeline;
//# sourceMappingURL=redis-base.js.map