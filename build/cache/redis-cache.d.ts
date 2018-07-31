/// <reference types="node" />
import { Serializer } from "../serializer";
import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";
import { Redis } from "../redis";
import { CacheHitRatioAnalyticsOptions } from "./hit-ratio-analytics";
interface Randomizer {
    random(lower?: number, upper?: number, floating?: boolean): number;
}
declare class DefaultRandomizer implements Randomizer {
    random(lower?: number | undefined, upper?: number | undefined, floating?: boolean | undefined): number;
}
declare class RedisCache implements ICache {
    private _prefix;
    private _jitter;
    private _hitRatioAnalytics;
    private _redis;
    protected readonly redis: Redis;
    private _serializer;
    private _randomizer;
    constructor(redis: Redis, prefix?: string, serializer?: Serializer<Buffer>, randomizer?: Randomizer, jitterInMilliseconds?: number, cacheHitRetionAnalyticsOptions?: CacheHitRatioAnalyticsOptions);
    protected generateKeyString(key: CacheKey): string;
    private generateExpirationWithJitter;
    getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined>;
    protected onGetByKeys(keys: CacheKey[], expire: number): Promise<Buffer[]>;
    getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]>;
    setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey>;
    protected onSetByEntities<TValue>(items: {
        key: string;
        value: Buffer;
        expire: number;
    }[], setExpiration: boolean): Promise<void>;
    setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]>;
    deleteByKey(key: CacheKey): Promise<void>;
    deleteByKeys(keys: CacheKey[]): Promise<void>;
    deleteByPattern(pattern: CacheKey): Promise<void>;
    clear(): Promise<void>;
}
export { RedisCache, Randomizer, DefaultRandomizer };
