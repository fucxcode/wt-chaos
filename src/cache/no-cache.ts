import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";

export default class NoCache implements ICache {

    constructor() {
    }

    public async getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined> {
        return;
    }

    public async getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]> {
        return [];
    }

    public async setByEntity<TValue>(value: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey | undefined> {
        return;
    }

    public async setByEntities<TValue>(values: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]> {
        return [];
    }

    public async deleteByKey(key: CacheKey): Promise<void> {
    }

    public async deleteByKeys(keys: CacheKey[]): Promise<void> {
    }

    public async deleteByPattern(pattern: CacheKey): Promise<void> {
    }

    public async clear(): Promise<void> {
    }
}