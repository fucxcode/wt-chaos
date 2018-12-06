import MongoMemoryServer from "mongodb-memory-server";
import * as mongodb from "mongodb";
import { MongoDBDriver, Entity, defaultValue, collectionName, Repository, MongoDBSession, MongoDBId, OperationDescription, Id, DeleteOptions, DeleteResult } from "../src/repository";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { assert } from "chai";
import { Timestamp, UID, Is } from "../src/constants";
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
            super(EntityType, undefined, () => driver, undefined, 10, 20);
        }

        public async findAll(operationDescription: OperationDescription): Promise<Partial<T>[]> {
            return this.driver.find<T>(this.collectionName, {});
        }

        public async erase(operationDescription: OperationDescription, condition?: any, multi: boolean = false, options?: DeleteOptions<MongoDBSession>): Promise<DeleteResult> {
            return await super.erase(operationDescription, condition, multi, options);
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
        const all_arr: ProjectEntity[] = [];
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

    it(`findOneById: match entity, condition not match, return undefined`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const expect = _.cloneDeep(_.sample(all_arr));
        const actual = await projectRepository.findOneById(operationDescription, expect._id, {
            name: _.randomString()
        });

        assert.isUndefined(actual);
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
        const match_arr = _.cloneDeep(_.sampleSize(all_arr, match_count));
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
        const match_arr = _.cloneDeep(_.sampleSize(all_arr, match_count));
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

    it(`findOneByIds: partial array ids, condition not match, return empty array`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: any[] = [];
        const count = _.random(10, 20);
        for (let i = 0; i < count; i++) {
            all_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, all_arr);

        const search_ids = _.map(_.sampleSize(all_arr, _.random(count / 2, count / 4 * 3)), x => x._id);
        const actual_arr = await projectRepository.findByIds(operationDescription, search_ids, {
            name: _.randomString()
        });

        assert.strictEqual(actual_arr.length, 0);
    });

    it(`findByPageIndex: total count = page size * page count`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageIndex(operationDescription, undefined, page_index, page_size);

            assert.strictEqual(result.count, total);
            assert.strictEqual(result.pageIndex, page_index);
            assert.strictEqual(result.pageSize, page_size);
            assert.strictEqual(result.pageCount, _.ceil(total / page_size));
            if (page_index < result.pageCount) {
                const remain_length = total - page_index * page_size;
                assert.strictEqual(result.entities.length, remain_length >= page_size ? page_size : remain_length);
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(expect_arr.length, actual_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: total count = page size * page count + 1`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageIndex(operationDescription, undefined, page_index, page_size);

            assert.strictEqual(result.count, total);
            assert.strictEqual(result.pageIndex, page_index);
            assert.strictEqual(result.pageSize, page_size);
            assert.strictEqual(result.pageCount, _.ceil(total / page_size));
            if (page_index < result.pageCount) {
                const remain_length = total - page_index * page_size;
                assert.strictEqual(result.entities.length, remain_length >= page_size ? page_size : remain_length);
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(expect_arr.length, actual_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: page index = undefined, page index = 0`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const result = await projectRepository.findByPageIndex(operationDescription, undefined, undefined, page_size);
        assert.strictEqual(result.count, total);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.pageCount, _.ceil(total / page_size));
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: page index = negative value, page index = 0`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const result = await projectRepository.findByPageIndex(operationDescription, undefined, -1, page_size);
        assert.strictEqual(result.count, total);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.pageCount, _.ceil(total / page_size));
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: page size = undefined, page size = 10`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 10;
        const result = await projectRepository.findByPageIndex(operationDescription, undefined, undefined, undefined);
        assert.strictEqual(result.count, total);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.pageCount, _.ceil(total / page_size));
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: page size = negative value, page size = 10`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 10;
        const result = await projectRepository.findByPageIndex(operationDescription, undefined, undefined, -1);
        assert.strictEqual(result.count, total);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.pageCount, _.ceil(total / page_size));
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: page size = exceed max value (21), page size = 20`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 20;
        const result = await projectRepository.findByPageIndex(operationDescription, undefined, undefined, 21);
        assert.strictEqual(result.count, total);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.pageCount, _.ceil(total / page_size));
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: total count = page size * page count`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageNext(operationDescription, undefined, page_index, page_size);

            assert.strictEqual(result.pageIndex, page_index);
            assert.strictEqual(result.pageSize, page_size);
            if (_.some(result.entities)) {
                const remain_length = total - page_index * page_size;
                assert.strictEqual(result.entities.length, remain_length >= page_size ? page_size : remain_length);
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
            }

            if (result.next) {
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(expect_arr.length, actual_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: total count = page size * page count + 1`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageNext(operationDescription, undefined, page_index, page_size);

            assert.strictEqual(result.pageIndex, page_index);
            assert.strictEqual(result.pageSize, page_size);
            if (_.some(result.entities)) {
                const remain_length = total - page_index * page_size;
                assert.strictEqual(result.entities.length, remain_length >= page_size ? page_size : remain_length);
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
            }

            if (result.next) {
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(expect_arr.length, actual_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: page index = undefined, page index = 0`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const result = await projectRepository.findByPageNext(operationDescription, undefined, undefined, page_size);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: page index = negative value, page index = 0`, async () => {
        const operationDescription = createOperationDescription();
        const page_size = _.random(2, 5);
        const page_count = _.random(2, 5);
        const total = page_size * page_count + 1;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const result = await projectRepository.findByPageNext(operationDescription, undefined, -1, page_size);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: page size = undefined, page size = 10`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 10;
        const result = await projectRepository.findByPageNext(operationDescription, undefined, undefined, undefined);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: page size = negative value, page size = 10`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 10;
        const result = await projectRepository.findByPageNext(operationDescription, undefined, undefined, -1);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: page size = exceed max value (21), page size = 20`, async () => {
        const operationDescription = createOperationDescription();
        const total = 21;
        const expect_arr: ProjectEntity[] = [];
        for (let i = 0; i < total; i++) {
            expect_arr.push({
                name: _.randomString()
            });
        }
        await projectRepository.insertMany(operationDescription, expect_arr);

        const page_size = 20;
        const result = await projectRepository.findByPageNext(operationDescription, undefined, undefined, 21);
        assert.strictEqual(result.pageIndex, 0);
        assert.strictEqual(result.pageSize, page_size);
        assert.strictEqual(result.entities.length, page_size);
        for (let i = 0; i < page_size; i++) {
            const expect = expect_arr[i];
            const actual = _.find(result.entities, x => x.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageIndex: condition`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        for (let i = 0; i < 10; i++) {
            all_arr.push({ name: _.randomString() });
        }
        const expect_arr = _.sampleSize(all_arr, 5);
        await projectRepository.insertMany(operationDescription, all_arr);

        const condition = {
            name: {
                $in: _.map(expect_arr, x => x.name)
            }
        };
        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageIndex(operationDescription, condition, page_index, 2);
            if (_.some(result.entities)) {
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
            }
            if (page_index < result.pageCount) {
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(actual_arr.length, expect_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, a => a.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`findByPageNext: condition`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        for (let i = 0; i < 10; i++) {
            all_arr.push({ name: _.randomString() });
        }
        const expect_arr = _.sampleSize(all_arr, 5);
        await projectRepository.insertMany(operationDescription, all_arr);

        const condition = {
            name: {
                $in: _.map(expect_arr, x => x.name)
            }
        };
        const actual_arr: ProjectEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await projectRepository.findByPageNext(operationDescription, condition, page_index, 2);
            if (_.some(result.entities)) {
                for (const entity of result.entities) {
                    actual_arr.push(entity);
                }
            }
            if (result.next) {
                page_index++;
            }
            else {
                break;
            }
        }

        assert.strictEqual(actual_arr.length, expect_arr.length);
        for (let i = 0; i < expect_arr.length; i++) {
            const expect = expect_arr[i];
            const actual = _.find(actual_arr, a => a.name === expect.name);
            assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
        }
    });

    it(`update: condition match 2, multi = false, update the 1st one`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        const search_name = _.randomString();
        all_arr.push({ name: search_name });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const result = await projectRepository.update(operationDescription,
            {
                name: search_name
            },
            {
                name: update_name
            }, false);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 1);
        assert.strictEqual(result.nModified, 1);

        const actual_arr = await projectRepository.findAll(operationDescription);
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[0]._id));
            assert.strictEqual(actual.name, update_name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[1]._id));
            assert.strictEqual(actual.name, all_arr[1].name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[2]._id));
            assert.strictEqual(actual.name, all_arr[2].name);
        }
    });

    it(`update: condition match 2, multi = true, update the 2`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        const search_name = _.randomString();
        all_arr.push({ name: search_name });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const result = await projectRepository.update(operationDescription,
            {
                name: search_name
            },
            {
                name: update_name
            }, true);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 2);
        assert.strictEqual(result.nModified, 2);

        const actual_arr = await projectRepository.findAll(operationDescription);
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[0]._id));
            assert.strictEqual(actual.name, update_name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[1]._id));
            assert.strictEqual(actual.name, all_arr[1].name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[2]._id));
            assert.strictEqual(actual.name, update_name);
        }
    });

    it(`update: condition match no, multi = true, update no`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const result = await projectRepository.update(operationDescription,
            {
                name: _.randomString()
            },
            {
                name: update_name
            }, true);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 0);
        assert.strictEqual(result.nModified, 0);

        const actual_arr = await projectRepository.findAll(operationDescription);
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[0]._id));
            assert.strictEqual(actual.name, all_arr[0].name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[1]._id));
            assert.strictEqual(actual.name, all_arr[1].name);
        }
        {
            const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, all_arr[2]._id));
            assert.strictEqual(actual.name, all_arr[2].name);
        }
    });

    it(`updateById, match id, update that one`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const expect_id = _.cloneDeep(_.sample(all_arr))._id;
        const update_name = _.randomString();
        const result = await projectRepository.updateById(operationDescription, expect_id, undefined, {
            name: update_name
        });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 1);
        assert.strictEqual(result.nModified, 1);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            if (driver.isEqualsIds(expect._id, expect_id)) {
                assert.strictEqual(actual.name, update_name);
            }
            else {
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`updateById, match id, condition not match, not update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const expect_id = _.cloneDeep(_.sample(all_arr))._id;
        const update_name = _.randomString();
        const result = await projectRepository.updateById(operationDescription, expect_id,
            {
                name: _.randomString()
            },
            {
                name: update_name
            });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 0);
        assert.strictEqual(result.nModified, 0);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`updateById, not match id, not update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const result = await projectRepository.updateById(operationDescription, driver.parseId(undefined, true), undefined, {
            name: update_name
        });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 0);
        assert.strictEqual(result.nModified, 0);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`updateByIds, match ids, not update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const result = await projectRepository.updateByIds(operationDescription,
            [
                driver.parseId(undefined, true),
                driver.parseId(undefined, true)
            ], undefined,
            {
                name: update_name
            });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 0);
        assert.strictEqual(result.nModified, 0);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`updateByIds, partial match ids, update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const matched_arr = _.cloneDeep(_.sampleSize(all_arr, 2));
        const not_matched_arr = [
            driver.parseId(undefined, true),
            driver.parseId(undefined, true)
        ];
        const search_arr = _.shuffle(_.map(matched_arr, x => x._id).concat(not_matched_arr));
        const update_name = _.randomString();
        const result = await projectRepository.updateByIds(operationDescription, search_arr, undefined, {
            name: update_name
        });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, matched_arr.length);
        assert.strictEqual(result.nModified, matched_arr.length);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            if (_.some(matched_arr, x => driver.isEqualsIds(expect._id, x._id))) {
                assert.strictEqual(actual.name, update_name);
            }
            else {
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`updateByIds, partial match ids, partial condition, update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        await projectRepository.insertMany(operationDescription, all_arr);

        const matched_arr = _.sampleSize(all_arr, 2);
        const not_matched_arr = [
            driver.parseId(undefined, true),
            driver.parseId(undefined, true)
        ];
        const condition = _.cloneDeep(_.sample(matched_arr));
        const search_arr = _.shuffle(_.map(matched_arr, x => x._id).concat(not_matched_arr));
        const update_name = _.randomString();
        const result = await projectRepository.updateByIds(operationDescription, search_arr,
            {
                name: condition.name
            },
            {
                name: update_name
            });

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.n, 1);
        assert.strictEqual(result.nModified, 1);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            if (driver.isEqualsIds(expect._id, condition._id)) {
                assert.strictEqual(actual.name, update_name);
            }
            else {
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`updateByEntity, match entity._id, property normal value, update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        const update_name = _.randomString();
        const update_entity = _.cloneDeep(_.sample(out_arr));
        update_entity.name = update_name;
        await projectRepository.updateByEntity(operationDescription, update_entity);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            if (driver.isEqualsIds(expect._id, update_entity._id)) {
                assert.strictEqual(actual.name, update_name);
            }
            else {
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`updateByEntity, match entity._id, property null value, update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        const update_entity = _.cloneDeep(_.sample(out_arr));
        update_entity.name = null;
        await projectRepository.updateByEntity(operationDescription, update_entity);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            if (driver.isEqualsIds(expect._id, update_entity._id)) {
                assert.isNull(actual.name);
            }
            else {
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`updateByEntity, match entity._id, property undefined, not update`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        const update_entity = _.cloneDeep(_.sample(out_arr));
        update_entity.name = undefined;
        await projectRepository.updateByEntity(operationDescription, update_entity);

        const actual_arr = await projectRepository.findAll(operationDescription);
        for (const actual of actual_arr) {
            const expect = _.find(all_arr, x => driver.isEqualsIds(x._id, actual._id));
            assert.strictEqual(actual.name, expect.name);
        }
    });

    it(`erase, condition = undefined, multi = false, 1st deleted`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        await projectRepository.erase(operationDescription, undefined, false);

        const actual_arr = await projectRepository.findAll(operationDescription);
        assert.strictEqual(actual_arr.length, all_arr.length - 1);
        for (let i = 0; i < all_arr.length; i++) {
            const expect = all_arr[i];
            if (i === 0) {
                assert.isFalse(_.some(actual_arr, x => x.name === expect.name));
            }
            else {
                const actual = _.find(actual_arr, x => x.name === expect.name);
                assert.isTrue(driver.isEqualsIds(actual._id, expect._id));
            }
        }
    });

    it(`erase, condition = undefined, multi = true, all deleted`, async () => {
        const operationDescription = createOperationDescription();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: _.randomString() });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        await projectRepository.erase(operationDescription, undefined, true);

        const actual_arr = await projectRepository.findAll(operationDescription);
        assert.strictEqual(actual_arr.length, 0);
    });

    it(`erase, condition = match multiple, multi = false, 1st deleted`, async () => {
        const operationDescription = createOperationDescription();
        const search_name = _.randomString();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        await projectRepository.erase(operationDescription, {
            name: search_name
        }, false);

        const actual_arr = await projectRepository.findAll(operationDescription);
        assert.strictEqual(actual_arr.length, 3);
        let deleted = false;
        for (const expect of all_arr) {
            if (expect.name === search_name && !deleted) {
                assert.isFalse(_.some(actual_arr, x => driver.isEqualsIds(x._id, expect._id)));
                deleted = true;
            }
            else {
                const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, expect._id));
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

    it(`erase, condition = match multiple, multi = true, all matched deleted`, async () => {
        const operationDescription = createOperationDescription();
        const search_name = _.randomString();
        const all_arr: ProjectEntity[] = [];
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        all_arr.push({ name: _.randomString() });
        all_arr.push({ name: search_name });
        const out_arr = await projectRepository.insertMany(operationDescription, all_arr);

        await projectRepository.erase(operationDescription, {
            name: search_name
        }, true);

        const actual_arr = await projectRepository.findAll(operationDescription);
        assert.strictEqual(actual_arr.length, 2);
        for (const expect of all_arr) {
            if (expect.name === search_name) {
                assert.isFalse(_.some(actual_arr, x => driver.isEqualsIds(x._id, expect._id)));
            }
            else {
                const actual = _.find(actual_arr, x => driver.isEqualsIds(x._id, expect._id));
                assert.strictEqual(actual.name, expect.name);
            }
        }
    });

});