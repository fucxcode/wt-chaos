import { EntityCacheKey } from "./entity-cache-key";
declare class EntityCacheHitRatioRecord {
    key: EntityCacheKey;
    hit: boolean;
    constructor(key: EntityCacheKey, hit: boolean);
}
interface EntityCacheHitRatioListener {
    miss(key: EntityCacheKey): Promise<void>;
    bingo(key: EntityCacheKey): Promise<void>;
    trackMultiple(records: EntityCacheHitRatioRecord[]): Promise<void>;
}
declare class EmptyEntityCacheHitRatioListener implements EntityCacheHitRatioListener {
    miss(key: EntityCacheKey): Promise<void>;
    bingo(key: EntityCacheKey): Promise<void>;
    trackMultiple(records: EntityCacheHitRatioRecord[]): Promise<void>;
}
export { EntityCacheHitRatioListener, EntityCacheHitRatioRecord, EmptyEntityCacheHitRatioListener };
