import { Driver } from "../driver";
import { Entity, Id } from "../../entities";
import { LokiSession } from "./loki-session";
import { LokiId } from "./loki-id";
import { InsertOneOptions } from "../insert-one-options";
import { InsertManyOptions } from "../insert-many-options";
import { CountOptions } from "../count-options";
import { FindOptions } from "../find-options";
import { UpdateOptions } from "../update-options";
import { UpdateResult } from "../update-result";
import { DeleteOptions } from "../delete-options";
import { DeleteResult } from "../delete-result";
import { FindOneAndUpdateOptions } from "../find-one-update-options";
import { BulkOperation } from "../bulk-operation";
import { AggregateOptions } from "../aggregate-options";
import { MapReduceOptions } from "../map-reduce-options";
import { Session } from "../session";
import Loki from "lokijs";
import * as _ from "../../../utilities";
import { Is } from "../../../constants";
import { LokiBulkOperation } from "./loki-bulk-operation";
import { ObjectID } from "bson";

class LokiDriver implements Driver<LokiSession, LokiId> {

    public get name(): string {
        return "lokijs";
    }

    private _db: Loki;

    constructor(databaseName: string = _.randomString(24, "alphabetic")) {
        this._db = new Loki(databaseName);
    }

    public parseId(id?: Id, createWhenNil: boolean = false): LokiId | null | undefined {
        if (id) {
            return new LokiId(id && id.toString());
        }
        else {
            if (createWhenNil) {
                return new LokiId();
            }
            else {
                return id;
            }
        }
    }

    public isValidId(id?: any): id is Id {
        return _.isNumber(_.get(id, "_value"));
    }

    public isEqualsIds(x?: Id, y?: Id): boolean {
        return (x && y) ? x.equals(y) : false;
    }

    private getOrAddCollection<T extends Entity>(collectionName: string): Loki.Collection<T> {
        let collection = this._db.getCollection<T>(collectionName);
        if (!collection) {
            collection = this._db.addCollection<T>(collectionName);
        }
        return collection;
    }

    public async insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<LokiSession>): Promise<Partial<T>> {
        entity._id = this.parseId(entity._id, true) as LokiId;
        this.getOrAddCollection<T>(collectionName).insert(entity);
        return entity;
    }

    public async insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<LokiSession>): Promise<Partial<T>[]> {
        for (const entity of entities) {
            entity._id = this.parseId(entity._id) as LokiId;
        }
        this.getOrAddCollection<T>(collectionName).insert(entities);
        return entities;
    }

    private parseCondition(condition: any): any {
        return _.isEmpty(condition) ? undefined : condition;
    }

    public async count(collectionName: string, condition: any | undefined, options?: CountOptions<LokiSession>): Promise<number> {
        return this.getOrAddCollection<any>(collectionName).count(this.parseCondition(condition));
    }

    public async find<T extends Entity>(collectionName: string, condition: any | undefined, options?: FindOptions<T, LokiSession>): Promise<Partial<T>[]> {
        console.log(JSON.stringify(this.parseCondition(condition), null, 2));
        let set = this.getOrAddCollection<T>(collectionName).chain().find(this.parseCondition(condition));
        if (options && options.sort && _.some(options.sort)) {
            const sorts: [keyof T, boolean][] = [];
            for (const s of options.sort) {
                sorts.push([
                    s[0],
                    s[1] === 1
                ]);
            }
            set = set.compoundsort(sorts);
        }
        if (options && options.skip) {
            set = set.offset(options.skip);
        }
        if (options && options.limit) {
            set = set.limit(options.limit);
        }

        const entities = set.data();
        if (options && options.projection) {
            return _.map(entities, x => _.project<T>(x, options.projection));
        }
        else {
            return entities;
        }
    }

    private update(collectionName: string, entity: any, update: any): boolean {
        let modified = false;
        if (update) {
            if (update.$set) {
                _.assign(entity, update.$set);
                modified = true;
            }
            if (update.$unset) {
                _.forOwn(update.$unset, (value, key) => {
                    if (value === Is.yes) {
                        delete entity[key];
                        modified = true;
                    }
                });
            }
            if (modified) {
                this.getOrAddCollection<any>(collectionName).update(entity);
            }
        }
        return modified;
    }

    public async updateOne(collectionName: string, condition: any, update: any, options?: UpdateOptions<LokiSession>): Promise<UpdateResult> {
        const result = {
            ok: Is.yes,
            n: 0,
            nModified: 0
        };
        const entity = this.getOrAddCollection<any>(collectionName).findOne(this.parseCondition(condition));
        if (entity) {
            result.n = 1;
            if (this.update(collectionName, entity, update)) {
                result.nModified = 1;
            }
        }
        return result;
    }

    public async updateMany(collectionName: string, condition: any, update: any, options?: UpdateOptions<LokiSession>): Promise<UpdateResult> {
        const result = {
            ok: Is.yes,
            n: 0,
            nModified: 0
        };
        const entities = this.getOrAddCollection<any>(collectionName).find(this.parseCondition(condition));
        if (entities) {
            result.n = entities.length;
            for (const entity of entities) {
                if (this.update(collectionName, entity, update)) {
                    result.nModified++;
                }
            }
        }
        return result;
    }

    private delete(collectionName: string, entity: any): void {
        this.getOrAddCollection(collectionName).remove(entity);
    }

    public async deleteOne(collectionName: string, condition: any, options?: DeleteOptions<LokiSession>): Promise<DeleteResult> {
        const result = {
            ok: Is.yes,
            n: 0
        };
        const entity = this.getOrAddCollection(collectionName).findOne(this.parseCondition(condition));
        if (entity) {
            this.delete(collectionName, entity);
            result.n = 1;
        }
        return result;
    }

    public async deleteMany(collectionName: string, condition: any, options?: DeleteOptions<LokiSession>): Promise<DeleteResult> {
        const result = {
            ok: Is.yes,
            n: 0
        };
        const entities = this.getOrAddCollection(collectionName).find(this.parseCondition(condition));
        if (entities) {
            result.n = entities.length;
            for (const entity of entities) {
                this.delete(collectionName, entity);
            }
        }
        return result;
    }

    public async findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, LokiSession>): Promise<Partial<T> | undefined> {
        const entity = this.getOrAddCollection<T>(collectionName).findOne(this.parseCondition(condition));
        if (entity) {
            this.update(collectionName, entity, update);
            if (options && options.returnOriginal) {
                return entity;
            }
            else {
                return this.getOrAddCollection<any>(collectionName).findOne({
                    $loki: entity.$loki
                });
            }
        }
    }

    public initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation {
        return new LokiBulkOperation(this.getOrAddCollection(collectionName), ordered);
    }

    public async aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<LokiSession>): Promise<Partial<T>[]> {
        throw new Error("not implements");
    }

    public async mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<LokiSession>): Promise<Partial<T>[]> {
        throw new Error("not implements");
    }

    public async beginTransaction<TResult>(action: (session: Session) => Promise<TResult | undefined>, thisArg?: any, auto: boolean = true): Promise<TResult | undefined> {
        throw new Error("not implements");
    }

    public async dropCollection(collectionName: string): Promise<boolean> {
        const collections = this._db.listCollections();
        if (_.some(collections, x => x.name === collectionName)) {
            this._db.removeCollection(collectionName);
            return true;
        }
        else {
            return false;
        }
    }

    public async createIndexes(EntityTypes: Function[], drop: boolean): Promise<any> {
        throw new Error("not implements");
    }
    
}

export { LokiDriver };