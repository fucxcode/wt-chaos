import { Driver } from "../driver";
import { Entity, Id } from "../../entities";
import { InsertOneOptions } from "../insert-one-options";
import { InsertManyOptions } from "../insert-many-options";
import { CountOptions } from "../count-options";
import { FindOptions } from "../find-options";
import { UpdateOptions } from "../update-options";
import { DeleteOptions } from "../delete-options";
import { FindOneAndUpdateOptions } from "../find-one-update-options";
import { UpdateResult } from "../update-result";
import { DeleteResult } from "../delete-result";
import { BulkOperation } from "../bulk-operation";
import { AggregateOptions } from "../aggregate-options";
import { MapReduceOptions } from "../map-reduce-options";
import * as mongodb from "mongodb";
import { ReadPreference, ReadWriteStrategy } from "../read-preference";
import * as _ from "../../../utilities";
import { Is } from "../../../constants";
import { Session } from "../session";
import { MaxTimeMsOptions } from "../max-time-ms-options";
import { SessionOptions } from "../session-option";
import { MongoDBId } from "./mongodb-id";
import { MongoDBSession } from "./mongodb-session";

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

    private _readWriteStrategy?: ReadWriteStrategy;

    constructor(client: mongodb.MongoClient, databaseName: string,
        defaultOpTimeMs: number = 5_000 /* 5 seconds */, maxOpTimeMs: number = 60_000 /* 1 minute */,
        readWriteStrategy?: ReadWriteStrategy) {
        this._client = client;
        this._databaseName = databaseName;
        this._db = this._client.db(this._databaseName);
        this._defaultOpTimeMs = defaultOpTimeMs;
        this._maxOpTimeMs = maxOpTimeMs;
        this._readWriteStrategy = readWriteStrategy;
    }

    private mergeOptions<TOptions extends MaxTimeMsOptions & SessionOptions<MongoDBSession>>(options?: TOptions, readPreferenceResolver?: (strategy: ReadWriteStrategy) => ReadPreference): {
        maxTimeMS: number,
        session?: mongodb.ClientSession,
        readPreference?: ReadPreference
    } {
        const result: {
            maxTimeMS: number,
            session?: mongodb.ClientSession,
            readPreference?: ReadPreference
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
        // merge read write strategy
        if (!result.readPreference && this._readWriteStrategy) {
            result.readPreference = readPreferenceResolver && readPreferenceResolver(this._readWriteStrategy);
        }
        return result;
    }

    public parseId(id?: Id, createWhenNil: boolean = false): MongoDBId | null | undefined {
        if (id) {
            return new MongoDBId(id && id.toString());
        }
        else {
            if (createWhenNil) {
                return new MongoDBId();
            }
            else {
                return id;
            }
        }
    }

    public isValidId(id?: any): id is Id {
        return mongodb.ObjectID.isValid(id);
    }

    public isEqualsIds(x?: Id, y?: Id): boolean {
        return (x && y) ? x.equals(y) : false;
    }

    public async insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<MongoDBSession>): Promise<Partial<T>> {
        entity._id = this.parseId(entity._id, true) as MongoDBId;
        await this._db.collection<T>(collectionName).insertOne(entity, this.mergeOptions(options));
        return entity;
    }

    public async insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<MongoDBSession>): Promise<Partial<T>[]> {
        for (const entity of entities) {
            entity._id = this.parseId(entity._id) as MongoDBId;
        }
        await this._db.collection<T>(collectionName).insertMany(entities, this.mergeOptions(options));
        return entities;
    }

    public async count(collectionName: string, condition: any | undefined, options?: CountOptions<MongoDBSession>): Promise<number> {
        return await this._db.collection(collectionName).countDocuments(condition, this.mergeOptions(options, strategy => strategy.findStrategy));
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
        const mergedOptions = this.mergeOptions(options, strategy => strategy.findStrategy);
        cursor = cursor.maxTimeMS(mergedOptions.maxTimeMS);
        if (mergedOptions.readPreference) {
            cursor = cursor.setReadPreference(mergedOptions.readPreference);
        }
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
            ok: Is.no,
            n: 0
        }, result.result);
    }

    public async deleteMany(collectionName: string, condition: any, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult> {
        const result = await this._db.collection(collectionName).deleteMany(condition, this.mergeOptions(options));
        return _.assign({
            ok: Is.no,
            n: 0
        }, result.result);
    }

    public async findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, MongoDBSession>): Promise<Partial<T> | undefined> {
        const result = await this._db.collection<Partial<T>>(collectionName).findOneAndUpdate(condition, update, this.mergeOptions(options));
        return result.value;
    }

    public initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation {
        return ordered ?
            this._db.collection(collectionName).initializeOrderedBulkOp() :
            this._db.collection(collectionName).initializeUnorderedBulkOp();
    }

    public async aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<MongoDBSession>): Promise<Partial<T>[]> {
        const cursor = this._db.collection(collectionName).aggregate<Partial<T>>(pipeline, this.mergeOptions(options, strategy => strategy.aggregateStrategy));
        return await cursor.toArray();
    }

    public async mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<MongoDBSession>): Promise<Partial<T>[]> {
        return await this._db.collection<T>(collectionName).mapReduce(map, reduce, this.mergeOptions(options, strategy => strategy.mapReduceStrategy));
    }

    public async beginTransaction<TResult>(action: (session: Session) => Promise<TResult | undefined>, thisArg?: any, auto: boolean = true): Promise<TResult | undefined> {
        const session = this._client.startSession();
        try {
            if (auto) {
                session.startTransaction();
            }
            const result: TResult | undefined = await action.call(thisArg, session);
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

    public async dropCollection(collectionName: string): Promise<boolean> {
        const collections = await this._db.listCollections(undefined, {
            nameOnly: true
        }).toArray();
        if (_.some(collections, c => c.name === collectionName)) {
            await this._db.dropCollection(collectionName);
            return true;
        }
        else {
            return false;
        }
    }

}

export { MongoDBDriver };