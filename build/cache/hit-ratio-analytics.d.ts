import { CacheKey } from "./cache-key";
import * as mongoose from "mongoose";
export declare class CacheHitRatioRecord {
    key: CacheKey;
    hit: boolean;
    constructor(key: CacheKey, hit: boolean);
}
export declare class CacheHitRatioAnalyticsOptions {
    collection: mongoose.Collection;
    predicate: () => boolean;
    constructor(collection: mongoose.Collection, predicate: () => boolean);
}
export declare class CacheHitRatioAnalytics {
    private _options;
    constructor(options: CacheHitRatioAnalyticsOptions);
    trackMultiple(records: CacheHitRatioRecord[]): Promise<void>;
    bingo(key: CacheKey): Promise<void>;
    miss(key: CacheKey): Promise<void>;
}
//# sourceMappingURL=hit-ratio-analytics.d.ts.map