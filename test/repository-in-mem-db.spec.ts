import { Driver, Session, InsertOneOptions, InsertManyOptions, CountOptions, FindOptions, UpdateOptions, UpdateResult, DeleteOptions, DeleteResult, FindOneAndUpdateOptions, BulkOperation, AggregateOptions, MapReduceOptions } from "../src/repository/drivers";
import uuid from "node-uuid";
import { Id, Entity } from "../src/repository/entities";
import * as _ from "../src/utilities";
import { Repository, OperationDescription } from "../src/repository";
import { UID } from "../src/constants";
import { assert } from "chai";

class InMemoryDbId extends String implements Id {

}

class InMemoryDbSession implements Session {

    private _id: string;
    public get id(): string {
        return this._id;
    }

    private _inTransaction: boolean;

    constructor() {
        this._id = uuid.v4();
        this._inTransaction = false;
    }

    public inTransaction(): boolean {
        return this._inTransaction;
    }

}

class InMemoryDbDriver implements Driver<InMemoryDbSession, InMemoryDbId> {

    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _collections: Map<string, Map<string, any>>;
    public get collections(): Map<string, Map<string, any>> {
        return this._collections;
    }

    constructor() {
        this._name = "in-memory-db";
        this._collections = new Map<string, Map<string, any>>();
    }

    private getCollectionByName(collectionName: string): Map<string, any> {
        let collection = this._collections.get(collectionName);
        if (!collection) {
            collection = new Map<string, any>();
            this._collections.set(collectionName, collection);
        }
        return collection;
    }

    public parseId(id?: Id): InMemoryDbId {
        return id ? id.toString() : uuid.v4();
    }

    public async insertOne<T extends Entity>(collectionName: string, entity: T, options?: InsertOneOptions<InMemoryDbSession>): Promise<Partial<T>> {
        entity._id = this.parseId(entity._id);
        this.getCollectionByName(collectionName).set(entity._id.toString(), entity);
        return entity;
    }

    public async insertMany<T extends Entity>(collectionName: string, entities: T[], options?: InsertManyOptions<InMemoryDbSession>): Promise<Partial<T>[]> {
        for (const entity of entities) {
            entity._id = this.parseId(entity._id);
            this.getCollectionByName(collectionName).set(entity._id.toString(), entity);
        }
        return entities;
    }

    public async count(collectionName: string, condition: any, options?: CountOptions<InMemoryDbSession>): Promise<number> {
        const entities = await this.find(collectionName, condition);
        return entities.length;
    }

    public async find<T extends Entity>(collectionName: string, condition: any, options?: FindOptions<T, InMemoryDbSession>): Promise<Partial<T>[]> {
        const collection = this.getCollectionByName(collectionName);
        const entities: T[] = [];
        for (const v of collection.values()) {
            if (_.isEmpty(condition)) {
                entities.push(v);
            }
            else {
                let matched = true;
                for (const key in condition) {
                    // special case for "$in"
                    if (condition[key].$in && _.isArray(condition[key].$in)) {
                        const arr: any[] = condition[key].$in;
                        if (_.some(arr, x => x === v[key])) {
                            continue;
                        }
                    }
                    // simple value equality
                    if (condition[key] !== v[key]) {
                        matched = false;
                        break;
                    }
                }
                if (matched) {
                    entities.push(v);
                }
            }
        }
        return entities;
    }

    private update(entities: any[], update: any): UpdateResult {
        const result = {
            ok: 1,
            n: 0,
            nModified: 0
        };
        if (_.some(entities)) {
            for (const entity of entities) {
                const $set = update.$set || update;
                const $unset = update.$unset;
                if ($set) {
                    for (const key in $set) {
                        entity[key] = $set[key];
                    }
                }
                if ($unset) {
                    for (const key in $unset) {
                        delete entity[key];
                    }
                }
                result.n++;
                result.nModified++;
            }
        }
        return result;
    }

    public async updateOne(collectionName: string, condition: any, update: any, options?: UpdateOptions<InMemoryDbSession>): Promise<UpdateResult> {
        const entities = await this.find(collectionName, condition);
        return this.update(_.take(entities, 1), update);
    }

    public async updateMany(collectionName: string, condition: any, update: any, options?: UpdateOptions<InMemoryDbSession>): Promise<UpdateResult> {
        const entities = await this.find(collectionName, condition);
        return this.update(entities, update);
    }

    public async deleteOne(collectionName: string, condition: any, options?: DeleteOptions<InMemoryDbSession>): Promise<DeleteResult> {
        const entities: Entity[] = await this.find(collectionName, condition);
        const entity = _.first(entities);
        if (entity) {
            const collection = this.getCollectionByName(collectionName);
            collection.delete(entity._id.toString());
            return {
                ok: 1,
                n: 1
            };
        }
        else {
            return {
                ok: 1,
                n: 0
            };
        }
    }

    public async deleteMany(collectionName: string, condition: any, options?: DeleteOptions<InMemoryDbSession>): Promise<DeleteResult> {
        const result = {
            ok: 1,
            n: 0
        };
        const entities: Entity[] = await this.find(collectionName, condition);
        const collection = this.getCollectionByName(collectionName);
        for (const entity of entities) {
            collection.delete(entity._id.toString());
            result.n++;
        }
        return result;
    }

    public async findOneAndUpdate<T extends Entity>(collectionName: string, condition: any, update: any, options?: FindOneAndUpdateOptions<T, InMemoryDbSession>): Promise<Partial<T> | undefined> {
        const entities = await this.find(collectionName, condition);
        const entity = _.first(entities);
        if (entity) {
            this.update([entity], update);
        }
        return entity;
    }

    public initializeBulkOp(collectionName: string, ordered: boolean): BulkOperation {
        throw new Error("not implemented");
    }

    public async aggregate<T>(collectionName: string, pipeline: any[], options?: AggregateOptions<InMemoryDbSession>): Promise<Partial<T>[]> {
        throw new Error("not implemented");
    }

    public async mapReduce<T>(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<InMemoryDbSession>): Promise<Partial<T>[]> {
        throw new Error("not implemented");
    }

    public dropCollection(collectionName: string): void {
        this._collections.delete(collectionName);
    }

    public dropDatabase(): void {
        this._collections.clear();
    }

}

interface ProductEntity extends Entity {

    name?: string;

    price?: number;

}

class ProductRepository extends Repository<InMemoryDbSession, InMemoryDbId, InMemoryDbDriver, ProductEntity> {

    public get collection(): Map<string, ProductEntity> {
        return this.driver.collections.get(this.collectionName);
    }

    constructor(driverProvider: () => InMemoryDbDriver) {
        super("products", driverProvider);
    }

}

describe("repository: in-mem-db", () => {

    let driver: InMemoryDbDriver;
    let repository: ProductRepository;
    let team: Id;
    let uid: UID;

    before(() => {
        driver = new InMemoryDbDriver();
        repository = new ProductRepository(() => driver);
        team = driver.parseId();
        uid = uuid.v4();
    });

    beforeEach(() => {
        driver.dropDatabase();
    });

    it(`save: one entity`, async () => {
        const product: ProductEntity = {
            name: uuid.v4(),
            price: _.random(0, 10000)
        };
        const od = new OperationDescription(uuid.v4(), team, uid);

        const result = await repository.save(od, product) as ProductEntity;

        assert.ok(result);
        assert.ok(result._id);
        assert.strictEqual(result.name, product.name);
        assert.strictEqual(result.price, product.price);

        const actual = repository.collection.get(result._id as string);
        assert.ok(actual);
        assert.ok(actual._id);
        assert.strictEqual(actual.name, product.name);
        assert.strictEqual(actual.price, product.price);
    });

    it(`save: many entities`, async () => {
        const products: ProductEntity[] = [];
        for (let i = 0; i < 10; i++) {
            const product: ProductEntity = {
                name: uuid.v4(),
                price: _.random(0, 10000)
            };
            products.push(product);
        }
        const od = new OperationDescription(uuid.v4(), team, uid);

        const result = await repository.save(od, products) as ProductEntity[];

        assert.ok(result);
        assert.strictEqual(result.length, products.length);
        for (const p of result) {
            assert.ok(p._id);

            const e = _.find(products, x => x.name === p.name);
            assert.ok(e);
            assert.strictEqual(p.price, e.price);

            const a = repository.collection.get(p._id as string);
            assert.ok(a);
            assert.strictEqual(p.name, a.name);
            assert.strictEqual(p.price, a.price);
        }
    });

    it(`count: no condition`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        const price_sp = _.random(1000, 2000);
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4(),
                price: _.random(0, 1, true) > 0.5 ? price_sp : _.random(0, 999)
            };
            await repository.save(od, product);
        }

        const count = await repository.count(od);
        assert.strictEqual(count, total);
    });

    it(`count: w/ condition`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        let total_sp = 0;
        const price_sp = _.random(1000, 2000);
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4()
            };
            const sp = _.random(0, 1, true) > 0.5;
            if (sp) {
                product.price = price_sp;
                total_sp++;
            }
            else {
                product.price = _.random(0, 999);
            }
            await repository.save(od, product);
        }

        const count = await repository.count(od, {
            price: price_sp
        });
        assert.strictEqual(count, total_sp);
    });

    it(`find one`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const products: ProductEntity[] = [];
        for (let i = 0; i < 100; i++) {
            const product: ProductEntity = {
                name: uuid.v4(),
                price: _.random(0, 999)
            };
            products.push(product);
        }
        await repository.save(od, products);

        const expect_entity = _.sample(products);
        const actual_entity = await repository.findOne(od, {
            name: expect_entity.name
        });
        assert.ok(actual_entity);
        assert.strictEqual(actual_entity._id, expect_entity._id);
        assert.strictEqual(actual_entity.name, expect_entity.name);
        assert.strictEqual(actual_entity.price, expect_entity.price);
    });

    it(`find one by id`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const products: ProductEntity[] = [];
        for (let i = 0; i < 100; i++) {
            const product: ProductEntity = {
                name: uuid.v4(),
                price: _.random(0, 999)
            };
            products.push(product);
        }
        await repository.save(od, products);

        const expect_entity = _.sample(products);
        const actual_entity = await repository.findOneById(od, expect_entity._id);
        assert.ok(actual_entity);
        assert.strictEqual(actual_entity._id, expect_entity._id);
        assert.strictEqual(actual_entity.name, expect_entity.name);
        assert.strictEqual(actual_entity.price, expect_entity.price);
    });

    it(`find one by ids`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const products: ProductEntity[] = [];
        for (let i = 0; i < 100; i++) {
            const product: ProductEntity = {
                name: uuid.v4(),
                price: _.random(0, 999)
            };
            products.push(product);
        }
        await repository.save(od, products);

        const expect_entities = _.sampleSize(products, 10);
        const actual_entities = await repository.findByIds(od, _.map(expect_entities, x => x._id));
        assert.ok(actual_entities);
        assert.strictEqual(actual_entities.length, expect_entities.length);
        for (const expect_entity of expect_entities) {
            const actual_entity = _.find(actual_entities, x => x._id.toString() === expect_entity._id.toString());
            assert.ok(actual_entity);
            assert.strictEqual(actual_entity.name, expect_entity.name);
            assert.strictEqual(actual_entity.price, expect_entity.price);
        }
    });

    it(`update, no condition, multi = false`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        const price_sp = _.random(1000, 2000);
        const products: ProductEntity[] = [];
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4()
            };
            const sp = _.random(0, 1, true) > 0.5;
            if (sp) {
                product.price = price_sp;
            }
            else {
                product.price = _.random(0, 999);
            }
            products.push(product);
        }
        await repository.save(od, products);

        const new_name = uuid.v4();
        await repository.update(od, undefined, {
            name: new_name
        });

        const actual = await repository.findOne(od, {
            name: new_name
        });
        assert.ok(actual);
        assert.strictEqual(actual._id, _.first(products)._id);
    });

    it(`update, no condition, multi = true`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        const price_sp = _.random(1000, 2000);
        const products: ProductEntity[] = [];
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4()
            };
            const sp = _.random(0, 1, true) > 0.5;
            if (sp) {
                product.price = price_sp;
            }
            else {
                product.price = _.random(0, 999);
            }
            products.push(product);
        }
        await repository.save(od, products);

        const new_name = uuid.v4();
        await repository.update(od, undefined, {
            name: new_name
        }, true);

        for (const actual of repository.collection.values()) {
            assert.strictEqual(actual.name, new_name);
        }
    });

    it(`update, w/ condition, multi = false`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        const price_sp = _.random(1000, 2000);
        const products: ProductEntity[] = [];
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4()
            };
            const sp = _.random(0, 1, true) > 0.5;
            if (sp) {
                product.price = price_sp;
            }
            else {
                product.price = _.random(0, 999);
            }
            products.push(product);
        }
        await repository.save(od, products);

        const new_name = uuid.v4();
        await repository.update(od,
            {
            price: price_sp
            },
            {
                name: new_name
            }
        );

        const actual = await repository.findOne(od, {
            name: new_name
        });
        const expect = _.first(_.filter(products, p => p.price === price_sp));
        assert.ok(actual);
        assert.ok(expect);
        assert.strictEqual(actual._id, expect._id);
    });

    it(`update, w/ condition, multi = true`, async () => {
        const od = new OperationDescription(uuid.v4(), team, uid);
        const total = 100;
        const price_sp = _.random(1000, 2000);
        const products: ProductEntity[] = [];
        for (let i = 0; i < total; i++) {
            const product: ProductEntity = {
                name: uuid.v4()
            };
            const sp = _.random(0, 1, true) > 0.5;
            if (sp) {
                product.price = price_sp;
            }
            else {
                product.price = _.random(0, 999);
            }
            products.push(product);
        }
        await repository.save(od, products);

        const new_name = uuid.v4();
        await repository.update(od,
            {
                price: price_sp
            },
            {
                name: new_name
            }, true
        );

        for (const actual of repository.collection.values()) {
            if (actual.price === price_sp) {
                assert.strictEqual(actual.name, new_name);
            }
        }
    });
});