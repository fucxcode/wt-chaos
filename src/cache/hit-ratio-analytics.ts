import { CacheKey } from "./cache-key";
import * as mongoose from "mongoose";
import * as _ from "../utilities";

export class CacheHitRatioRecord {

    constructor(
        public key: CacheKey,
        public hit: boolean
    ) {
    }
}

export class CacheHitRatioAnalyticsOptions {

    constructor(
        public collection: mongoose.Collection,
        public predicate: () => boolean
    ) {
    }
}

export class CacheHitRatioAnalytics {

    private _options: CacheHitRatioAnalyticsOptions;

    constructor(options: CacheHitRatioAnalyticsOptions) {
        this._options = options;
    }

    public async trackMultiple(records: CacheHitRatioRecord[]): Promise<void> {
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

    public async bingo(key: CacheKey): Promise<void> {
        if (this._options.predicate()) {
            await this._options.collection.updateOne(
                {
                    team: _.parseObjectId(key.team),
                    collection_name: key.collectionName,
                    target_id: _.parseObjectId(key.id)
                },
                {
                    $inc: {
                        n_hits: 1
                    }
                },
                {
                    upsert: true
                }
            );
        }
    }

    public async miss(key: CacheKey): Promise<void> {
        if (this._options.predicate()) {
            await this._options.collection.updateOne(
                {
                    team: _.parseObjectId(key.team),
                    collection_name: key.collectionName,
                    target_id: _.parseObjectId(key.id)
                },
                {
                    $inc: {
                        n_misses: 1
                    }
                },
                {
                    upsert: true
                }
            );
        }
    }
}