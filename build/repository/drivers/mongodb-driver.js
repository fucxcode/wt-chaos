"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
const _ = __importStar(require("../../utilities"));
const constants_1 = require("../../constants");
class MongoDBId extends mongodb.ObjectId {
    constructor(id) {
        super(id);
    }
    toString() {
        return super.toString();
    }
}
exports.MongoDBId = MongoDBId;
class MongoDBDriver {
    get name() {
        return "mongodb";
    }
    get databaseName() {
        return this._databaseName;
    }
    constructor(client, databaseName, defaultOpTimeMs = 30000 /* 30 seconds */, maxOpTimeMs = 120000 /* 2 minutes */) {
        this._client = client;
        this._databaseName = databaseName;
        this._db = this._client.db(this._databaseName);
        this._defaultOpTimeMs = defaultOpTimeMs;
        this._maxOpTimeMs = Math.max(defaultOpTimeMs, maxOpTimeMs);
    }
    calculateOpTimeMs(options) {
        const opTimeMs = (options && options.maxTimeMS) ?
            options.maxTimeMS :
            this._defaultOpTimeMs;
        return Math.min(opTimeMs, this._maxOpTimeMs);
    }
    mergeOptions(options) {
        const result = _.assign({}, options);
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
    parseId(id) {
        return new MongoDBId(id && id.toString());
    }
    async insertOne(collectionName, entity, options) {
        entity._id = this.parseId(entity._id);
        await this._db.collection(collectionName).insertOne(entity, this.mergeOptions(options));
        return entity;
    }
    async insertMany(collectionName, entities, options) {
        for (const entity of entities) {
            entity._id = this.parseId(entity._id);
        }
        await this._db.collection(collectionName).insertMany(entities, this.mergeOptions(options));
        return entities;
    }
    async count(collectionName, condition, options) {
        return await this._db.collection(collectionName).countDocuments(condition, this.mergeOptions(options));
    }
    async find(collectionName, condition, options) {
        let cursor = this._db.collection(collectionName).find(condition);
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
    async updateOne(collectionName, condition, update, options) {
        return (await this._db.collection(collectionName).updateOne(condition, update, this.mergeOptions(options))).result;
    }
    async updateMany(collectionName, condition, update, options) {
        return (await this._db.collection(collectionName).updateMany(condition, update, this.mergeOptions(options))).result;
    }
    async deleteOne(collectionName, condition, options) {
        const result = await this._db.collection(collectionName).deleteOne(condition, this.mergeOptions(options));
        return _.assign({
            ok: constants_1.is.no,
            n: 0
        }, result.result);
    }
    async deleteMany(collectionName, condition, options) {
        const result = await this._db.collection(collectionName).deleteMany(condition, this.mergeOptions(options));
        return _.assign({
            ok: constants_1.is.no,
            n: 0
        }, result.result);
    }
    async findOneAndUpdate(collectionName, condition, update, options) {
        options = _.assign({}, options, {
            maxTimeMS: this.calculateOpTimeMs(options)
        });
        const result = await this._db.collection(collectionName).findOneAndUpdate(condition, update, this.mergeOptions(options));
        return result.value;
    }
    initializeBulkOp(collectionName, ordered) {
        return ordered ?
            this._db.collection(collectionName).initializeOrderedBulkOp() :
            this._db.collection(collectionName).initializeUnorderedBulkOp();
    }
    async aggregate(collectionName, pipeline, options) {
        const cursor = this._db.collection(collectionName).aggregate(pipeline, this.mergeOptions(options));
        return await cursor.toArray();
    }
    async mapReduce(collectionName, map, reduce, options) {
        return await this._db.collection(collectionName).mapReduce(map, reduce, this.mergeOptions(options));
    }
    async beginTransaction(action, thisArg, auto = true) {
        const session = this._client.startSession();
        try {
            if (auto) {
                session.startTransaction();
            }
            const result = await action.call(thisArg, session);
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
exports.MongoDBDriver = MongoDBDriver;
class MongoDBSession {
    get session() {
        return this._session;
    }
    get id() {
        return this._session.id;
    }
    constructor(session) {
        this._session = session;
    }
    inTransaction() {
        return this._session.inTransaction();
    }
}
exports.MongoDBSession = MongoDBSession;
//# sourceMappingURL=mongodb-driver.js.map