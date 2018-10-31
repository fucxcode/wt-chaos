import { EntityCacheKey } from "./entity-cache-key";

class EntityCacheHitRatioRecord {

    constructor(
        public key: EntityCacheKey,
        public hit: boolean
    ) {
    }
}

interface EntityCacheHitRatioListener {

    miss(key: EntityCacheKey): Promise<void>;

    bingo(key: EntityCacheKey): Promise<void>;

    trackMultiple(records: EntityCacheHitRatioRecord[]): Promise<void>;

}

class EmptyEntityCacheHitRatioListener implements EntityCacheHitRatioListener {

    public async miss(key: EntityCacheKey): Promise<void> {
    }

    public async bingo(key: EntityCacheKey): Promise<void> {
    }

    public async trackMultiple(records: EntityCacheHitRatioRecord[]): Promise<void> {
    }

}

export { EntityCacheHitRatioListener, EntityCacheHitRatioRecord, EmptyEntityCacheHitRatioListener };