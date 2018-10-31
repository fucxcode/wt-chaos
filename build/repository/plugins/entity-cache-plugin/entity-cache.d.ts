/// <reference types="node" />
import { EntityCacheHitRatioListener } from "./entity-cache-hit-ratio-listener";
import { Serializer } from "../../../serializer";
import { EntityCacheKey } from "./entity-cache-key";
import { Cache } from "../../../cache";
interface Randomizer {
    random(lower?: number, upper?: number, floating?: boolean): number;
}
declare class DefaultRandomizer implements Randomizer {
    random(lower?: number | undefined, upper?: number | undefined, floating?: boolean | undefined): number;
}
declare class EntityCache {
    private _prefix;
    private _jitter;
    private _hitRatioListener;
    private _cache;
    protected readonly cache: Cache;
    private _serializer;
    private _randomizer;
    constructor(cache: Cache, prefix?: string, serializer?: Serializer<Buffer>, randomizer?: Randomizer, jitterInMilliseconds?: number, listener?: EntityCacheHitRatioListener);
    protected generateKeyString(key: EntityCacheKey): string;
    private generateExpirationWithJitter;
    getByKey<TValue>(key: EntityCacheKey, expireInMilliseconds?: number): Promise<TValue | undefined>;
    protected onGetByKeys(keys: EntityCacheKey[], expire: number): Promise<Buffer[]>;
    getByKeys<TValue>(keys: EntityCacheKey[], expireInMilliseconds?: number): Promise<(TValue | undefined)[]>;
    setByEntity<TValue>(entity: TValue, keyResolver: (v: TValue) => EntityCacheKey, expireInMilliseconds?: number): Promise<EntityCacheKey>;
    protected onSetByEntities<TValue>(items: {
        key: string;
        value: Buffer;
        expire: number;
    }[], setExpiration: boolean): Promise<void>;
    setByEntities<TValue>(entities: TValue[], keyResolver: (v: TValue) => EntityCacheKey, expireInMilliseconds?: number): Promise<EntityCacheKey[]>;
    deleteByKey(key: EntityCacheKey): Promise<void>;
    deleteByKeys(keys: EntityCacheKey[]): Promise<void>;
    deleteByPattern(pattern: EntityCacheKey): Promise<void>;
    clear(): Promise<void>;
}
export { EntityCache, Randomizer, DefaultRandomizer };
