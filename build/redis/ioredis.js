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
class RedisHelpers {
    static convertKeyValuePairsToFirstRest(keyValuePairs) {
        if (_.some(keyValuePairs)) {
            const first = _.first(keyValuePairs);
            const rest = _.chain(keyValuePairs)
                .tail()
                .map(x => [x["0"], x["1"]])
                .flatten()
                .valueOf();
            return {
                first: first,
                rest: rest
            };
        }
    }
}
exports.RedisHelpers = RedisHelpers;
class IORedis {
    constructor(redis) {
        this._redis = redis;
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
        const result = RedisHelpers.convertKeyValuePairsToFirstRest(keyValuePairs);
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
    scan(options) {
        return new Promise((resolve, reject) => {
            const keys = [];
            const stream = this.scanStream(options);
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
    async clear() {
        return await this._redis.flushall();
    }
    multi() {
        return new IORedisPipeline(this._redis.multi());
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
exports.IORedis = IORedis;
class IORedisPipeline {
    constructor(multi) {
        this._multi = multi;
    }
    pexpire(key, milliseconds) {
        this._multi.pexpire(key, milliseconds);
    }
    mset(...keyValuePairs) {
        const result = RedisHelpers.convertKeyValuePairsToFirstRest(keyValuePairs);
        if (result) {
            this._multi.mset(result.first["0"], result.first["1"], ...result.rest);
        }
    }
    async exec() {
        return await this._multi.exec();
    }
}
exports.IORedisPipeline = IORedisPipeline;
