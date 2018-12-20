import MongoMemoryServer from "mongodb-memory-server";
import { MongoDBDriver, Entity, collectionName, defaultValue, Repository, MongoDBSession, MongoDBId, OperationDescription, FindOptions } from "../src/repository";
import { assert } from "chai";
import * as _ from "../src/utilities";
import { MongoClient } from "mongodb";
import { UID, Timestamp, Direction } from "../src/constants";
import * as uuid from "node-uuid";

describe("#198230: Repository.findByPageIndex & Repository.findByPageIndex allow sort by _id desc", () => {

    const COLLECTION_NAME_TASKS = "tasks";
    const mongod = new MongoMemoryServer();
    let client: MongoClient;
    let driver: MongoDBDriver;

    @collectionName(COLLECTION_NAME_TASKS)
    // @ts-ignore
    class TaskEntity extends Entity {
        name?: string;
        created_by?: UID;
        created_at?: Timestamp;
    }

    class TaskRepository extends Repository<MongoDBSession, MongoDBId, MongoDBDriver, TaskEntity> {
        constructor() {
            super(TaskEntity, () => driver);
        }
    }

    const taskRepository = new TaskRepository();

    const createOperationDescription = function (): OperationDescription {
        return new OperationDescription(uuid.v4(), driver.parseId(undefined, true), uuid.v4());
    };

    before(async () => {
        const uri = await mongod.getConnectionString();
        const dbName = await mongod.getDbName();
        client = await MongoClient.connect(uri, { useNewUrlParser: true });
        driver = new MongoDBDriver(client, dbName);
    });

    beforeEach(async () => {
        await driver.dropCollection(COLLECTION_NAME_TASKS);
    });

    after(async () => {
        await client.close();
        await mongod.stop();
    });

    const fetchAllByPageIndex = async function (operationDescription: OperationDescription, options?: FindOptions<TaskEntity, MongoDBSession>): Promise<TaskEntity[]> {
        const actual_entities: TaskEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await taskRepository.findByPageIndex(operationDescription, undefined, page_index, 2, options);
            if (page_index < result.pageCount) {
                for (const entity of result.entities) {
                    actual_entities.push(entity);
                }
                page_index++;
            }
            else {
                break;
            }
        }
        return actual_entities;
    };

    const fetchAllByPageNext = async function (operationDescription: OperationDescription, options?: FindOptions<TaskEntity, MongoDBSession>): Promise<TaskEntity[]> {
        const actual_entities: TaskEntity[] = [];
        let page_index = 0;
        while (true) {
            const result = await taskRepository.findByPageNext(operationDescription, undefined, page_index, 2, options);
            if (_.some(result.entities)) {
                for (const entity of result.entities) {
                    actual_entities.push(entity);
                }
            }
            if (result.next) {
                page_index++;
            }
            else {
                break;
            }
        }
        return actual_entities;
    };

    it(`no sort, page by _id asc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        {
            const actual_entities = await fetchAllByPageIndex(operationDescription);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
    });

    it(`sort by property with same value, page by _id asc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        const options: FindOptions<TaskEntity, MongoDBSession> = {
            sort: [
                ["created_by", Direction.ascending]
            ]
        };
        {
            const actual_entities = await fetchAllByPageIndex(operationDescription, options);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription, options);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
    });

    it(`sort by property with different value asc, page by property value asc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        const options: FindOptions<TaskEntity, MongoDBSession> = {
            sort: [
                ["created_at", Direction.ascending]
            ]
        };
        const expect_entities = _.sortBy(input_entities, x => x.created_at);
        {
            const actual_entities = await fetchAllByPageIndex(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
    });

    it(`sort by property with different value desc, page by property value desc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        const options: FindOptions<TaskEntity, MongoDBSession> = {
            sort: [
                ["created_at", Direction.descending]
            ]
        };
        const expect_entities = _.sortBy(input_entities, x => x.created_at * -1);
        {
            const actual_entities = await fetchAllByPageIndex(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
    });

    it(`sort by _id asc, page by _id asc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        const options: FindOptions<TaskEntity, MongoDBSession> = {
            sort: [
                ["_id", Direction.ascending]
            ]
        };
        const expect_entities = _.sortBy(input_entities, x => x._id);
        {
            const actual_entities = await fetchAllByPageIndex(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription, options);
            assert.deepStrictEqual(actual_entities, expect_entities);
        }
    });

    it(`sort by _id desc, page by _id desc`, async () => {
        const operationDescription = createOperationDescription();
        const input_entities: TaskEntity[] = [];
        for (let i = 0; i < 5; i++) {
            const entity = new TaskEntity();
            entity.name = _.randomString();
            entity.created_by = operationDescription.uid;
            entity.created_at = Date.now();
            input_entities.push(entity);
        }
        await taskRepository.insertMany(operationDescription, input_entities);


        const options: FindOptions<TaskEntity, MongoDBSession> = {
            sort: [
                ["_id", Direction.descending]
            ]
        };
        _.reverse(input_entities);
        {
            const actual_entities = await fetchAllByPageIndex(operationDescription, options);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
        {
            const actual_entities = await fetchAllByPageNext(operationDescription, options);
            assert.deepStrictEqual(actual_entities, input_entities);
        }
    });

});