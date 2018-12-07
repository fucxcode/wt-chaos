import { Entity, Id } from "../entities";
import { InsertOneOptions } from "./insert-one-options";
import { InsertManyOptions } from "./insert-many-options";
import { CountOptions } from "./count-options";
import { FindOptions } from "./find-options";
import { UpdateOptions } from "./update-options";
import { DeleteOptions } from "./delete-options";
import { UpdateResult } from "./update-result";
import { DeleteResult } from "./delete-result";
import { FindOneAndUpdateOptions } from "./find-one-update-options";
import { BulkOperation } from "./bulk-operation";
import { AggregateOptions } from "./aggregate-options";
import { MapReduceOptions } from "./map-reduce-options";
import { Session } from "./session";

interface Driver<TSession extends Session, TID extends Id> {

    name: string;

    parseId(id?: Id, createWhenNil?: boolean): TID | null | undefined;

    isValidId(id?: any): id is Id;

    isEqualsIds(x?: Id, y?: Id): boolean;

    insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<TSession>): Promise<Partial<T>>;

    insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<TSession>): Promise<Partial<T>[]>;

    count(collectionName: string, condition: any, options?: CountOptions<TSession>): Promise<number>;

    find<T extends Entity>(collectionName: string, condition: any, options?: FindOptions<T, TSession>): Promise<Partial<T>[]>;

    updateOne(collectionName: string, condition: any, update: any, options?: UpdateOptions<TSession>): Promise<UpdateResult>;

    updateMany(collectionName: string, condition: any, update: any, options?: UpdateOptions<TSession>): Promise<UpdateResult>;

    deleteOne(collectionName: string, condition: any, options?: DeleteOptions<TSession>): Promise<DeleteResult>;

    deleteMany(collectionName: string, condition: any, options?: DeleteOptions<TSession>): Promise<DeleteResult>;

    findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, TSession>): Promise<Partial<T> | undefined>;

    initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation;

    aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<TSession>): Promise<Partial<T>[]>;

    mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<TSession>): Promise<Partial<T>[]>;

    dropCollection(collectionName: string): Promise<boolean>;

    createIndexes<T extends Entity>(EntityTypes: Function[], drop: boolean): Promise<any>;
    
}

export { Driver };