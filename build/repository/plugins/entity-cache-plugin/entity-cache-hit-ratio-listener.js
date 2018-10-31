"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityCacheHitRatioRecord {
    constructor(key, hit) {
        this.key = key;
        this.hit = hit;
    }
}
exports.EntityCacheHitRatioRecord = EntityCacheHitRatioRecord;
class EmptyEntityCacheHitRatioListener {
    async miss(key) {
    }
    async bingo(key) {
    }
    async trackMultiple(records) {
    }
}
exports.EmptyEntityCacheHitRatioListener = EmptyEntityCacheHitRatioListener;
//# sourceMappingURL=entity-cache-hit-ratio-listener.js.map