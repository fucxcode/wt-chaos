import { Driver } from "./driver";
import { Entity, Id } from "../entities";
import { InsertOneOptions } from "./insert-one-options";
import { InsertManyOptions } from "./insert-many-options";
import { CountOptions } from "./count-options";
import { FindOptions } from "./find-options";
import { UpdateOptions } from "./update-options";
import { DeleteOptions } from "./delete-options";
import { FindOneAndUpdateOptions } from "./find-one-update-options";
import { UpdateResult } from "./update-result";
import { DeleteResult } from "./delete-result";
import { BulkOperation } from "./bulk-operation";
import { AggregateOptions } from "./aggregate-options";
import { MapReduceOptions } from "./map-reduce-options";
import * as mongodb from "mongodb";
import { Session } from "./session";
declare class MongoDBId extends mongodb.ObjectId implements Id {
    constructor(id?: string | number | mongodb.ObjectId);
    toString(): string;
}
declare class MongoDBDriver implements Driver<MongoDBSession, MongoDBId> {
    readonly name: string;
    private _db;
    private _client;
    private _databaseName;
    readonly databaseName: string;
    private _defaultOpTimeMs;
    private _maxOpTimeMs;
    constructor(client: mongodb.MongoClient, databaseName: string, defaultOpTimeMs?: number, maxOpTimeMs?: number);
    private mergeOptions;
    parseId(id?: Id): MongoDBId;
    insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<MongoDBSession>): Promise<Partial<T>>;
    insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<MongoDBSession>): Promise<Partial<T>[]>;
    count(collectionName: string, condition: any | undefined, options?: CountOptions<MongoDBSession>): Promise<number>;
    find<T extends Entity>(collectionName: string, condition: any | undefined, options?: FindOptions<T, MongoDBSession>): Promise<Partial<T>[]>;
    updateOne(collectionName: string, condition: any, update: any, options?: UpdateOptions<MongoDBSession>): Promise<UpdateResult>;
    updateMany(collectionName: string, condition: any, update: any, options?: UpdateOptions<MongoDBSession>): Promise<UpdateResult>;
    deleteOne(collectionName: string, condition: any, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult>;
    deleteMany(collectionName: string, condition: any, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult>;
    findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, MongoDBSession>): Promise<Partial<T> | undefined>;
    initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation;
    aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<MongoDBSession>): Promise<Partial<T>[]>;
    mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<MongoDBSession>): Promise<Partial<T>[]>;
    beginTransaction<TResult>(action: (session: Session) => Promise<TResult | undefined>, thisArg?: any, auto?: boolean): Promise<TResult | undefined>;
}
declare class MongoDBSession implements Session {
    private _session;
    readonly session: mongodb.ClientSession;
    readonly id: any;
    constructor(session: mongodb.ClientSession);
    inTransaction(): boolean;
}
export { MongoDBId, MongoDBDriver, MongoDBSession };
