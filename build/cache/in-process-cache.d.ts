import { ICache } from "./i-cache";
import { CacheKey } from "./cache-key";
export default class InProcessCache implements ICache {
    private _prefix;
    private _map;
    readonly map: Map<string, any>;
    constructor(prefix: string);
    getByKey<TValue>(key: CacheKey, expireInMilliseconds?: number): Promise<TValue | undefined>;
    getByKeys<TValue>(keys: CacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]>;
    setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey | undefined>;
    setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => CacheKey, expireInMilliseconds?: number): Promise<CacheKey[]>;
    deleteByKey(key: CacheKey): Promise<void>;
    deleteByKeys(keys: CacheKey[]): Promise<void>;
    deleteByPattern(pattern: CacheKey): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=in-process-cache.d.ts.map