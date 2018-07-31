import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";
export default class NoCache implements ICache {
    constructor();
    getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined>;
    getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]>;
    setByEntity<TValue>(value: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey | undefined>;
    setByEntities<TValue>(values: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]>;
    deleteByKey(key: CacheKey): Promise<void>;
    deleteByKeys(keys: CacheKey[]): Promise<void>;
    deleteByPattern(pattern: CacheKey): Promise<void>;
    clear(): Promise<void>;
}
