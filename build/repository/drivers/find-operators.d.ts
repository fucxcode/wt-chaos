import { BulkOperation } from "./bulk-operation";
export interface FindOperators {
    length: number;
    delete(): BulkOperation;
    deleteOne(): BulkOperation;
    replaceOne(doc: any): BulkOperation;
    update(doc: any): BulkOperation;
    updateOne(doc: any): BulkOperation;
    upsert(): FindOperators;
}
