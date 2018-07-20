import { CacheKey } from "./cache-key";
interface ICache {
    getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue>;
    getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<TValue[]>;
    setByEntity<TValue>(value: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey>;
    setByEntities<TValue>(values: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]>;
    deleteByKey(key: CacheKey): Promise<void>;
    deleteByKeys(keys: CacheKey[]): Promise<void>;
    deleteByPattern(pattern: CacheKey): Promise<void>;
    clear(): Promise<void>;
}
export { ICache };
