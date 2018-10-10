import { Entity } from "../entities";
import { FSyncOptions } from "./fsync-options";
import { FindOperators } from "./find-operators";
import { BulkWriteResult } from "./bulk-write-result";

export interface BulkOperation {
    length: number;

    execute(options?: FSyncOptions): Promise<BulkWriteResult>;

    // doesn't support find in bulk operation
    // since in this stage we only use bulk to insert docs
    // find(selector: any): FindOperators;

    insert<T extends Entity>(doc: T): BulkOperation;
    
}