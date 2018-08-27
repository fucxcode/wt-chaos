"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
class CacheHitRatioRecord {
    constructor(key, hit) {
        this.key = key;
        this.hit = hit;
    }
}
exports.CacheHitRatioRecord = CacheHitRatioRecord;
class CacheHitRatioAnalyticsOptions {
    constructor(collection, predicate) {
        this.collection = collection;
        this.predicate = predicate;
    }
}
exports.CacheHitRatioAnalyticsOptions = CacheHitRatioAnalyticsOptions;
class CacheHitRatioAnalytics {
    constructor(options) {
        this._options = options;
    }
    async trackMultiple(records) {
        if (this._options.predicate()) {
            const bulk = this._options.collection.initializeUnorderedBulkOp();
            for (const record of records) {
                const update = {
                    $inc: {}
                };
                if (record.hit) {
                    update.$inc = {
                        n_hits: 1
                    };
                }
                else {
                    update.$inc = {
                        n_misses: 1
                    };
                }
                bulk.find({
                    team: _.parseObjectId(record.key.team),
                    collection_name: record.key.collectionName,
                    target_id: _.parseObjectId(record.key.id)
                }).upsert().updateOne(update);
            }
            await bulk.execute();
        }
    }
    async bingo(key) {
        if (this._options.predicate()) {
            await this._options.collection.updateOne({
                team: _.parseObjectId(key.team),
                collection_name: key.collectionName,
                target_id: _.parseObjectId(key.id)
            }, {
                $inc: {
                    n_hits: 1
                }
            }, {
                upsert: true
            });
        }
    }
    async miss(key) {
        if (this._options.predicate()) {
            await this._options.collection.updateOne({
                team: _.parseObjectId(key.team),
                collection_name: key.collectionName,
                target_id: _.parseObjectId(key.id)
            }, {
                $inc: {
                    n_misses: 1
                }
            }, {
                upsert: true
            });
        }
    }
}
exports.CacheHitRatioAnalytics = CacheHitRatioAnalytics;
//# sourceMappingURL=hit-ratio-analytics.js.map