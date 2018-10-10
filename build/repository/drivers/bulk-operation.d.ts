import { Entity } from "../entities";
import { FSyncOptions } from "./fsync-options";
import { BulkWriteResult } from "./bulk-write-result";
export interface BulkOperation {
    length: number;
    execute(options?: FSyncOptions): Promise<BulkWriteResult>;
    insert<T extends Entity>(doc: T): BulkOperation;
}
