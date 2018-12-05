import MongoMemoryServer from "mongodb-memory-server";
import * as mongodb from "mongodb";
import { MongoDBDriver, Entity, defaultValue, collectionName, Repository, MongoDBSession, MongoDBId, OperationDescription, Id } from "../src/repository";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { assert } from "chai";
import { Timestamp, UID } from "../src/constants";
import { WTCode } from "../src/errors";
import { $ } from "./$";

describe("repository: mongodb memory server", () => {

    const COLLECTION_NAME_PROJECTS = "projects";
    const COLLECTION_NAME_TASKS = "tasks";

    const mongod = new MongoMemoryServer();

    let client: mongodb.MongoClient;
    let driver: MongoDBDriver;

    @collectionName(COLLECTION_NAME_PROJECTS)
    // @ts-ignore
    class ProjectEntity extends Entity {

        @defaultValue((operationDescription) => operationDescription.team)
        // @ts-ignore
        team?: Id;

        name?: string;

        @defaultValue(() => Date.now())
        // @ts-ignore
        created_at?: Timestamp;

        @defaultValue((operationDescription) => operationDescription.uid)
        // @ts-ignore
        created_by?: UID;

    }

    @collectionName(COLLECTION_NAME_TASKS)
    // @ts-ignore
    class TaskEntity extends Entity {

        @defaultValue((operationDescription) => operationDescription.team)
        // @ts-ignore
        team?: Id;

        project_id?: Id;

        title?: string;

        @defaultValue(() => Date.now())
        // @ts-ignore
        created_at?: Timestamp;

        @defaultValue((operationDescription) => operationDescription.uid)
        // @ts-ignore
        created_by?: UID;
    }

    abstract class MongoDBRepository<T extends Entity> extends Repository<MongoDBSession, MongoDBId, MongoDBDriver, T> {

        constructor(EntityType: Function) {
            super(EntityType, undefined, () => driver);
        }

        public async findAll(operationDescription: OperationDescription): Promise<Partial<T>[]> {
            return this.driver.find<T>(this.collectionName, {});
        }

    }


    class ProjectRepository extends MongoDBRepository<ProjectEntity> {

        constructor() {
            super(ProjectEntity);
        }

    }

    class TaskRepository extends MongoDBRepository<TaskEntity> {

        constructor() {
            super(TaskEntity);
        }

    }

    const projectRepository = new ProjectRepository();
    const taskRepository = new TaskRepository();

    const createOperationDescription = function (): OperationDescription {
        return new OperationDescription(uuid.v4(), driver.parseId(undefined, true), uuid.v4());
    };

    before(async () => {
        const uri = await mongod.getConnectionString();
        const dbName = await mongod.getDbName();
        client = await mongodb.MongoClient.connect(uri, { useNewUrlParser: true });
        driver = new MongoDBDriver(client, dbName);
    });

    beforeEach(async () => {
        await driver.dropCollection(COLLECTION_NAME_PROJECTS);
        await driver.dropCollection(COLLECTION_NAME_TASKS);
    });

    after(async () => {
        await client.close();
        await mongod.stop();
    });

    it(`insert one entity`, async () => {
        const operationDescription = createOperationDescription();
        const expect = {
            name: _.randomString()
        };

        const begin = Date.now();
        const result = await projectRepository.insertOne(operationDescription, expect);
        const actual = await projectRepository.findOne(operationDescription, {
            name: expect.name
        });
        const end = Date.now();

        assert.isTrue(driver.isValidId(result._id));
        assert.isTrue(driver.isValidId(actual._id));
        assert.isTrue(driver.isValidId(result.team));
        assert.isTrue(driver.isValidId(actual.team));
        assert.strictEqual(result.name, expect.name);
        assert.strictEqual(actual.name, expect.name);
        assert.isTrue(driver.isEqualsIds(result.team, operationDescription.team));
        assert.isTrue(driver.isEqualsIds(actual.team, operationDescription.team));
        assert.strictEqual(result.created_by, operationDescription.uid);
        assert.strictEqual(actual.created_by, operationDescription.uid);
        assert.isTrue(result.created_at >= begin && result.created_at <= end);
        assert.isTrue(actual.created_at >= begin && result.created_at <= end);
        assert.strictEqual(result.created_at, actual.created_at);

    });

    it(`insert many entities`, async () => {
        const operationDescription = createOperationDescription();
        const expect_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            expect_arr.push({ name: _.randomString() });
        }

        const begin = Date.now();
        const result_arr = await projectRepository.insertMany(operationDescription, expect_arr);
        const actual_arr = await projectRepository.findAll(operationDescription);
        const end = Date.now();

        for (const expect of expect_arr) {
            const result = _.find(result_arr, x => x.name === expect.name);
            const actual = _.find(actual_arr, x => x.name === expect.name);
            assert.isTrue(driver.isValidId(result._id));
            assert.isTrue(driver.isValidId(actual._id));
            assert.isTrue(driver.isValidId(result.team));
            assert.isTrue(driver.isValidId(actual.team));
            assert.strictEqual(result.name, expect.name);
            assert.strictEqual(actual.name, expect.name);
            assert.isTrue(driver.isEqualsIds(result.team, operationDescription.team));
            assert.isTrue(driver.isEqualsIds(actual.team, operationDescription.team));
            assert.strictEqual(result.created_by, operationDescription.uid);
            assert.strictEqual(actual.created_by, operationDescription.uid);
            assert.isTrue(result.created_at >= begin && result.created_at <= end);
            assert.isTrue(actual.created_at >= begin && result.created_at <= end);
            assert.strictEqual(result.created_at, actual.created_at);
        }

    });

    it(`count: no condition`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({ name: _.randomString() });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        {
            const actual = await projectRepository.count(operationDescription);
            assert.strictEqual(actual, all_arr.length);
        }
        {
            const actual = await projectRepository.count(operationDescription, {});
            assert.strictEqual(actual, all_arr.length);
        }

    });

    it(`count: has condition`, async () => {
        const operationDescription = createOperationDescription();
        const special_name = _.randomString();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.sample([true, false]) ? special_name : _.randomString()
            });
        }
        const expect_arr = _.filter(all_arr, x => x.name === special_name);
        await projectRepository.insertMany(operationDescription, expect_arr);

        const actual = await projectRepository.count(operationDescription, {
            name: special_name
        });

        assert.strictEqual(actual, expect_arr.length);
    });

    it(`findOne: no match entity`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const actual = await projectRepository.findOne(operationDescription, {
            name: _.randomString()
        });

        assert.isUndefined(actual);
    });

    it(`findOne: one match entity, throw when multiple = true`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        const special = _.sample(all_arr);
        special.name = _.randomString();
        await projectRepository.insertMany(operationDescription, all_arr);

        const actual = await projectRepository.findOne(operationDescription, {
            name: special.name
        }, true);

        assert.strictEqual(actual.name, special.name);
    });

    it(`findOne: multiple match entity, throw when multiple = true, should throw exception`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        const special_name = _.randomString();
        const special_arr = _.sampleSize(all_arr, 2);
        for (const special of special_arr) {
            special.name = special_name;
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        await $.throwAsync(async () => {
            await projectRepository.findOne(operationDescription, {
                name: special_name
            }, true);
        }, WTCode.invalidInput, "expected one document but retrieve multiple by condition");
    });

    it(`findOne: multiple match entity, throw when multiple = false, not throw exception`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        const special_name = _.randomString();
        const special_arr = _.sampleSize(all_arr, 2);
        for (const special of special_arr) {
            special.name = special_name;
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const actual = await projectRepository.findOne(operationDescription, {
            name: special_name
        }, false);

        assert.strictEqual(actual.name, special_arr[0].name);
    });

    it(`findOneById: no match entity, return undefined`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const search_id = driver.parseId(undefined, true);
        const actual = await projectRepository.findOneById(operationDescription, search_id);

        assert.isUndefined(actual);
    });

    it(`findOneById: match entity, return that one`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const expect = _.sample(all_arr);
        const actual = await projectRepository.findOneById(operationDescription, expect._id);

        assert.strictEqual(actual.name, expect.name);
    });

    it(`findOneByIds: no match entity, return empty array`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const expect_arr: MongoDBId[] = [];
        const expect_count = _.random(count / 2, count / 4 * 3);
        for (let i = 0; i < expect_count; i++) {
            expect_arr.push(driver.parseId(undefined, true));
        }
        const actual = await projectRepository.findByIds(operationDescription, expect_arr);

        assert.strictEqual(actual.length, 0);
    });

    it(`findOneByIds: partial match entity, return matched array`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const not_match_arr: MongoDBId[] = [];
        const not_match_count = _.random(count / 2, count / 4 * 3);
        for (let i = 0; i < not_match_count; i++) {
            not_match_arr.push(driver.parseId(undefined, true));
        }
        const match_count = _.random(count / 2, count / 4 * 3);
        const match_arr = _.sampleSize(all_arr, match_count);
        const search_ids = _.shuffle(_.map(match_arr, x => x._id).concat(not_match_arr));

        const actual_arr = await projectRepository.findByIds(operationDescription, search_ids);

        assert.strictEqual(actual_arr.length, match_arr.length);
        for (const actual of actual_arr) {
            const expect = _.find(match_arr, x => driver.isEqualsIds(actual._id, x._id));
            assert.ok(expect);
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`findOneByIds: duplicate match entity, return matched array and not duplicated`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const match_count = _.random(count / 2, count / 4 * 3);
        const match_arr = _.sampleSize(all_arr, match_count);
        const search_ids: MongoDBId[] = [];
        for (const match of match_arr) {
            for (let i = 0; i < _.random(1, 3); i++) {
                search_ids.push(match._id);
            }
        }

        const actual_arr = await projectRepository.findByIds(operationDescription, search_ids);

        assert.strictEqual(actual_arr.length, match_arr.length);
        for (const actual of actual_arr) {
            const expect = _.find(match_arr, x => driver.isEqualsIds(actual._id, x._id));
            assert.ok(expect);
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`findOneByIds: empty array ids, return empty array`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const actual_arr = await projectRepository.findByIds(operationDescription, []);

        assert.strictEqual(actual_arr.length, 0);
    });

});