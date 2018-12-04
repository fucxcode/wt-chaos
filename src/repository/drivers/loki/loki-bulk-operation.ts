import { BulkOperation } from "../bulk-operation";
import { Entity } from "../../entities";
import { FSyncOptions } from "../fsync-options";
import { BulkWriteResult } from "../bulk-write-result";
import Loki from "lokijs";
import { Is } from "../../../constants";
import * as _ from "../../../utilities";

class LokiBulkOperation implements BulkOperation {

    private _docs: any[];

    private _collection: Loki.Collection;

    private _ordered: boolean;

    constructor(collection: Loki.Collection, ordered: boolean) {
        this._docs = [];
        this._collection = collection;
        this._ordered = ordered;
    }

    public get length(): number {
        return this._docs.length;
    }

    public async execute(options?: FSyncOptions): Promise<BulkWriteResult> {
        const result = {
            ok: Is.yes,
            nInserted: 0,
            nUpdated: 0,
            nUpserted: 0,
            nModified: 0,
            nRemoved: 0
        };
        const docs = this._ordered ? this._docs : _.shuffle(this._docs);
        for (const doc of docs) {
            this._collection.insert(doc);
            result.nInserted++;
        }
        return result;
    }

    // doesn't support find in bulk operation
    // since in this stage we only use bulk to insert docs
    // find(selector: any): FindOperators;

    public insert<T extends Entity>(doc: T): BulkOperation {
        this._docs.push(doc);
        return this;
    }
}

export { LokiBulkOperation };