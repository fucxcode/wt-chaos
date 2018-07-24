import * as _ from "../utilities";
import { Serializer, BSONSerializer } from "../serializer";
import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";
import { Redis } from "../redis";
import { CacheHitRatioAnalytics, CacheHitRatioAnalyticsOptions, CacheHitRatioRecord } from "./hit-ratio-analytics";

interface Randomizer {

    random(lower?: number, upper?: number, floating?: boolean): number;

}

class DefaultRandomizer implements Randomizer {

    public random(lower?: number | undefined, upper?: number | undefined, floating?: boolean | undefined): number {
        return _.random(lower, upper, floating);
    }

}

class RedisCache implements ICache {

    private _prefix: string;
    private _jitter: number;
    private _hitRatioAnalytics!: CacheHitRatioAnalytics;

    private _redis: Redis;
    protected get redis(): Redis {
        return this._redis;
    }

    private _serializer: Serializer<Buffer>;

    private _randomizer: Randomizer;

    constructor(redis: Redis,
        prefix: string = "",
        serializer: Serializer<Buffer> = new BSONSerializer(),
        randomizer: Randomizer = new DefaultRandomizer(),
        jitterInMilliseconds: number = 50,
        cacheHitRetionAnalyticsOptions?: CacheHitRatioAnalyticsOptions) {
        this._redis = redis;
        this._prefix = prefix;
        this._serializer = serializer;
        this._randomizer = randomizer;
        this._jitter = jitterInMilliseconds;
        if (cacheHitRetionAnalyticsOptions) {
            this._hitRatioAnalytics = new CacheHitRatioAnalytics(cacheHitRetionAnalyticsOptions);
        }
    }

    protected generateKeyString(key: CacheKey): string {
        return key.toString(this._prefix);
    }

    private generateExpirationWithJitter(expires: number | undefined): number {
        return expires ? (expires + this._randomizer.random(0, this._jitter, false)) : 0;
    }

    public async getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined> {
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
            return this._serializer.deserialize<TValue>(buffer);
        }
    }

    protected async onGetByKeys(keys: CacheKey[], expire: number): Promise<Buffer[]> {
        const keysString = _.map(keys, x => this.generateKeyString(x));
        const buffers = await (this._redis as any).mgetBuffer(...keysString);
        if (expire) {
            const multi = this._redis.multi();
            for (const keyString of keysString) {
                multi.pexpire(keyString, expire);
            }
            await multi.exec();
        }
        return buffers;
    }

    public async getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]> {
        if (_.some(keys)) {
            const expire = this.generateExpirationWithJitter(expireInMilliseconds);
            const buffers = await this.onGetByKeys(keys, expire);

            const records: CacheHitRatioRecord[] = [];
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const result = buffers[i];
                records.push(new CacheHitRatioRecord(key, !!result));
            }
            await this._hitRatioAnalytics && this._hitRatioAnalytics.trackMultiple(records);

            return _.chain(buffers)
                .filter(x => !_.isEmpty(x))
                .map(x => this._serializer.deserialize<TValue>(x))
                .valueOf();
        }
        else {
            return [];
        }
    }

    public async setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey> {
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

    protected async onSetByEntities<TValue>(items: {
        key: string,
        value: Buffer,
        expire: number
    }[], setExpiration: boolean) {
        const keyValuePairs: [string, Buffer][] = [];
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

    public async setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]> {
        const keys: CacheKey[] = [];
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

    public async deleteByKey(key: CacheKey): Promise<void> {
        await this._redis.del(this.generateKeyString(key));
    }

    public async deleteByKeys(keys: CacheKey[]): Promise<void> {
        await this._redis.del(..._.map(keys, x => this.generateKeyString(x)));
    }

    public deleteByPattern(pattern: CacheKey): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const keys: string[] = [];
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

    public async clear(): Promise<void> {
        await this._redis.clear();
    }

 }

export { RedisCache, Randomizer, DefaultRandomizer };