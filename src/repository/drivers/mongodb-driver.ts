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
import { ReadPreference } from "./read-preference";
import * as _ from "../../utilities";
import { is } from "../../constants";
import { FSyncOptions } from "./fsync-options";
import { BulkWriteResult } from "./bulk-write-result";
import { FindOperators } from "./find-operators";
import { Session } from "./session";
import { MaxTimeMsOptions } from "./max-time-ms-options";
import { SessionOptions } from "./session-option";

class MongoDBId extends mongodb.ObjectId implements Id {

    constructor(id?: string | number | mongodb.ObjectId) {
        super(id);
    }

    public toString(): string {
        return super.toString();
    }

}

class MongoDBDriver implements Driver<MongoDBSession, MongoDBId> {

    public get name(): string {
        return "mongodb";
    }

    private _db: mongodb.Db;

    private _client: mongodb.MongoClient;

    private _databaseName: string;
    public get databaseName(): string {
        return this._databaseName;
    }

    private _defaultOpTimeMs: number;

    private _maxOpTimeMs: number;

    constructor(client: mongodb.MongoClient, databaseName: string, defaultOpTimeMs: number = 5_000 /* 5 seconds */, maxOpTimeMs: number = 60_000 /* 1 minute */) {
        this._client = client;
        this._databaseName = databaseName;
        this._db = this._client.db(this._databaseName);
        this._defaultOpTimeMs = defaultOpTimeMs;
        this._maxOpTimeMs = maxOpTimeMs;
    }

    private calculateOpTimeMs(options?: {
        maxTimeMS?: number
    }) {
        const opTimeMs = (options && options.maxTimeMS) ?
            options.maxTimeMS :
            this._defaultOpTimeMs;
        return Math.min(opTimeMs, this._maxOpTimeMs);
    }

    private mergeOptions<TOptions extends MaxTimeMsOptions & SessionOptions<MongoDBSession>>(options?: TOptions): {
        maxTimeMS: number,
        session?: mongodb.ClientSession
    } {
        const result: {
            maxTimeMS: number,
            session?: mongodb.ClientSession
        } = _.assign({}, options);
        // calculate max time ms
        if (options && options.maxTimeMS) {
            result.maxTimeMS = Math.min(options.maxTimeMS, this._maxOpTimeMs);
        }
        else {
            result.maxTimeMS = Math.min(this._defaultOpTimeMs, this._maxOpTimeMs);
        }
        // merge session
        if (options && options.session) {
            result.session = options.session.session;
        }
        return result;
    }

    public parseId(id?: Id): MongoDBId {
        return new MongoDBId(id && id.toString());
    }

    public async insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<MongoDBSession>): Promise<Partial<T>> {
        entity._id = this.parseId(entity._id);
        await this._db.collection<T>(collectionName).insertOne(entity, this.mergeOptions(options));
        return entity;
    }

    public async insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<MongoDBSession>): Promise<Partial<T>[]> {
        for (const entity of entities) {
            entity._id = this.parseId(entity._id);
        }
        await this._db.collection<T>(collectionName).insertMany(entities, this.mergeOptions(options));
        return entities;
    }

    public async count(collectionName: string, condition: any | undefined, options?: CountOptions<MongoDBSession>): Promise<number> {
        return await this._db.collection(collectionName).countDocuments(condition, this.mergeOptions(options));
    }

    public async find<T extends Entity>(collectionName: string, condition: any | undefined, options?: FindOptions<T, MongoDBSession>): Promise<Partial<T>[]> {
        let cursor = this._db.collection<Partial<T>>(collectionName).find(condition);
        if (options && options.projection) {
            cursor = cursor.project(options.projection);
        }
        if (options && options.skip) {
            cursor = cursor.skip(options.skip);
        }
        if (options && options.limit) {
            cursor = cursor.limit(options.limit);
        }
        if (options && options.sort) {
            cursor = cursor.sort(options.sort);
        }
        if (options && options.hint) {
            cursor = cursor.hint(options.hint);
        }
        if (options && options.readPreference) {
            cursor = cursor.setReadPreference(options.readPreference);
        }
        cursor = cursor.maxTimeMS(this.mergeOptions(options).maxTimeMS);
        // in current version of mongodb node.js driver there's no property we can specify `session` when perform `find`
        // but in case it might be added in the future we had added generic type argument in `FindOptions`
        return await cursor.toArray();
    }

    public async updateOne(collectionName: string, condition: any, update: any, options?: UpdateOptions<MongoDBSession>): Promise<UpdateResult> {
        return (await this._db.collection(collectionName).updateOne(condition, update, this.mergeOptions(options))).result;
    }

    public async updateMany(collectionName: string, condition: any, update: any, options?: UpdateOptions<MongoDBSession>): Promise<UpdateResult> {
        return (await this._db.collection(collectionName).updateMany(condition, update, this.mergeOptions(options))).result;
    }

    public async deleteOne(collectionName: string, condition: any, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult> {
        const result = await this._db.collection(collectionName).deleteOne(condition, this.mergeOptions(options));
        return _.assign({
            ok: is.no,
            n: 0
        }, result.result);
    }

    public async deleteMany(collectionName: string, condition: any, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult> {
        const result = await this._db.collection(collectionName).deleteMany(condition, this.mergeOptions(options));
        return _.assign({
            ok: is.no,
            n: 0
        }, result.result);
    }

    public async findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, MongoDBSession>): Promise<Partial<T> | undefined> {
        options = _.assign({}, options, {
            maxTimeMS: this.calculateOpTimeMs(options)
        });
        const result = await this._db.collection<Partial<T>>(collectionName).findOneAndUpdate(condition, update, this.mergeOptions(options));
        return result.value;
    }

    public initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation {
        return ordered ?
            this._db.collection(collectionName).initializeOrderedBulkOp() :
            this._db.collection(collectionName).initializeUnorderedBulkOp();
    }

    public async aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<MongoDBSession>): Promise<Partial<T>[]> {
        const cursor = this._db.collection(collectionName).aggregate<Partial<T>>(pipeline, this.mergeOptions(options));
        return await cursor.toArray();
    }

    public async mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<MongoDBSession>): Promise<Partial<T>[]> {
        return await this._db.collection<T>(collectionName).mapReduce(map, reduce, this.mergeOptions(options));
    }

    public async beginTransaction<TResult>(action: (session: Session) => Promise<TResult | undefined>, thisArg?: any, auto: boolean = true): Promise<TResult | undefined> {
        const session = this._client.startSession();
        try {
            if (auto) {
                session.startTransaction();
            }
            const result: TResult = await action.call(thisArg, session);
            if (auto && session.inTransaction()) {
                await session.commitTransaction();
            }
            return result;
        }
        catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            throw error;
        }
        finally {
            session.endSession();
        }
    }

}

class MongoDBSession implements Session {

    private _session: mongodb.ClientSession;
    public get session(): mongodb.ClientSession {
        return this._session;
    }

    public get id(): any {
        return this._session.id;
    }

    constructor(session: mongodb.ClientSession) {
        this._session = session;
    }

    public inTransaction(): boolean {
        return this._session.inTransaction();
    }

}

// class MongoDBBulkOperation implements BulkOperation {
    
//     public get length(): number {
//         return this._bulk.length;
//     }

//     public set length(value: number) {
//         this._bulk.length = value;
//     }

//     private _bulk: mongodb.OrderedBulkOperation | mongodb.UnorderedBulkOperation;

//     constructor(bulk: mongodb.OrderedBulkOperation | mongodb.UnorderedBulkOperation) {
//         this._bulk = bulk;
//     }

//     public async execute(options?: FSyncOptions): Promise<BulkWriteResult> {
//         const result = await this._bulk.execute(options);
//         return _.pick(result, [
//             "ok",
//             "nInserted",
//             "nUpdated",
//             "nUpserted",
//             "nModified",
//             "nRemoved",
//         ]);
//     }

//     public insert<T extends Entity>(doc: T): BulkOperation {
//         this._bulk.insert(doc);
//         return this;
//     }

// }

export { MongoDBId, MongoDBDriver, MongoDBSession };