import MongoMemoryServer from "mongodb-memory-server";
import * as mongodb from "mongodb";
import { MongoDBDriver, collectionName, Id, indexes, Entity, getCollectionNameFromEntity, IndexSpecification, BusinessEntity, Index } from "../src/repository";
import { Timestamp, UID, Direction, Is } from "../src/constants";
import { assert } from "chai";
import * as _ from "../src/utilities";

describe("driver: create indexes", () => {

    const COLLECTION_NAME_PROJECTS = "projects";
    const COLLECTION_NAME_TASKS = "tasks";

    const mongod = new MongoMemoryServer();

    let client: mongodb.MongoClient;
    let dbName: string;
    let driver: MongoDBDriver;

    const INDEXES_PROJECTS: IndexSpecification<ProjectEntity>[] = [
        {
            key: {
                team: Direction.ascending
            }
        },
        {
            key: {
                created_by: Direction.ascending,
                created_at: Direction.descending
            }
        },
        {
            key: {
                name: Direction.ascending
            },
            name: "_idx_name",
            background: true,
            unique: true
        }
    ];
    @collectionName(COLLECTION_NAME_PROJECTS)
    @indexes<ProjectEntity>(INDEXES_PROJECTS)
    // @ts-ignore
    class ProjectEntity extends Entity {
        team?: Id;
        name?: string;
        created_at?: Timestamp;
        created_by?: UID;
    }

    const INDEXES_TASKS: IndexSpecification<TaskEntity>[] = [
        {
            key: {
                team: Direction.ascending,
                project_id: Direction.ascending
            }
        },
        {
            key: {
                title: Direction.ascending
            }
        }
    ];
    @indexes<TaskEntity>(INDEXES_TASKS)
    @collectionName(COLLECTION_NAME_TASKS)
    // @ts-ignore
    class TaskEntity extends Entity {
        team?: Id;
        project_id?: Id;
        title?: string;
        created_at?: Timestamp;
        created_by?: UID;
    }

    const COLLECTION_NAME_BASE = "base_entities";
    const BASE_INDEXES: IndexSpecification<BaseEntity>[] = [
        {
            key: {
                name: Direction.ascending
            }
        }
    ];
    @collectionName(COLLECTION_NAME_BASE)
    @indexes<BaseEntity>(BASE_INDEXES)
    // @ts-ignore
    class BaseEntity extends Entity {
        name: string;
    }

    const COLLECTION_NAME_SUB = "sub_entities";
    const SUB_INDEXES: IndexSpecification<SubEntity>[] = [
        {
            key: {
                age: Direction.ascending
            }
        }
    ];
    @collectionName(COLLECTION_NAME_SUB)
    @indexes<SubEntity>(SUB_INDEXES)
    // @ts-ignore
    class SubEntity extends BaseEntity {
        age: number;
    }

    const COLLECTION_NAME_SIMPLE = "simple";
    const INDEXES_SIMPLE: Index<SimpleIndexEntity>[] = [
        {
            name: Direction.ascending
        }
    ];
    @collectionName(COLLECTION_NAME_SIMPLE)
    @indexes<SimpleIndexEntity>(INDEXES_SIMPLE)
    // @ts-ignore
    class SimpleIndexEntity extends Entity {
        name: string;
    }

    before(async () => {
        const uri = await mongod.getConnectionString();
        dbName = await mongod.getDbName();
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

    it(`create indexes, drop = false`, async () => {
        const result = await driver.createIndexes([
            ProjectEntity,
            TaskEntity
        ], false);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.drop, false);
        assert.strictEqual(result.collections.length, 2);

        const projectCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_PROJECTS);
        assert.strictEqual(projectCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(projectCollectionResult.nIndexesAfter, 4);
        const projectCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).listIndexes().toArray();
        for (const expect of INDEXES_PROJECTS) {
            const actual = _.find(projectCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

        const taskCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_TASKS);
        assert.strictEqual(taskCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(taskCollectionResult.nIndexesAfter, 3);
        const taskCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_TASKS).listIndexes().toArray();
        for (const expect of INDEXES_TASKS) {
            const actual = _.find(taskCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

    });

    it(`create indexes, drop = true, no existing indexes`, async () => {
        const result = await driver.createIndexes([
            ProjectEntity,
            TaskEntity
        ], true);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.drop, true);
        assert.strictEqual(result.collections.length, 2);

        const projectCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_PROJECTS);
        assert.strictEqual(projectCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(projectCollectionResult.nIndexesAfter, 4);
        const projectCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).listIndexes().toArray();
        for (const expect of INDEXES_PROJECTS) {
            const actual = _.find(projectCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

        const taskCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_TASKS);
        assert.strictEqual(taskCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(taskCollectionResult.nIndexesAfter, 3);
        const taskCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_TASKS).listIndexes().toArray();
        for (const expect of INDEXES_TASKS) {
            const actual = _.find(taskCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

    });

    it(`create indexes, drop = true, has existing indexes`, async () => {
        await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).createIndexes([
            {
                key: {
                    team: 1,
                    name: 1
                }
            }
        ]);
        await client.db(dbName).collection(COLLECTION_NAME_TASKS).createIndexes([
            {
                key: {
                    created_at: 1
                }
            },
            {
                key: {
                    created_by: 1
                }
            }
        ]);

        const result = await driver.createIndexes([
            ProjectEntity,
            TaskEntity
        ], true);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.drop, true);
        assert.strictEqual(result.collections.length, 2);

        const projectCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_PROJECTS);
        assert.strictEqual(projectCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(projectCollectionResult.nIndexesAfter, 4);
        const projectCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).listIndexes().toArray();
        for (const expect of INDEXES_PROJECTS) {
            const actual = _.find(projectCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

        const taskCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_TASKS);
        assert.strictEqual(taskCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(taskCollectionResult.nIndexesAfter, 3);
        const taskCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_TASKS).listIndexes().toArray();
        for (const expect of INDEXES_TASKS) {
            const actual = _.find(taskCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

    });

    it(`create indexes, drop = false, has existing indexes`, async () => {
        await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).createIndexes([
            {
                key: {
                    team: 1,
                    name: 1
                }
            }
        ]);
        await client.db(dbName).collection(COLLECTION_NAME_TASKS).createIndexes([
            {
                key: {
                    created_at: 1
                }
            },
            {
                key: {
                    created_by: 1
                }
            }
        ]);

        const result = await driver.createIndexes([
            ProjectEntity,
            TaskEntity
        ], false);

        assert.strictEqual(result.ok, Is.yes);
        assert.strictEqual(result.drop, false);
        assert.strictEqual(result.collections.length, 2);

        const projectCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_PROJECTS);
        assert.strictEqual(projectCollectionResult.nIndexesBefore, 2);
        assert.strictEqual(projectCollectionResult.nIndexesAfter, 5);
        const projectCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_PROJECTS).listIndexes().toArray();
        for (const expect of INDEXES_PROJECTS) {
            const actual = _.find(projectCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

        const taskCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_TASKS);
        assert.strictEqual(taskCollectionResult.nIndexesBefore, 3);
        assert.strictEqual(taskCollectionResult.nIndexesAfter, 5);
        const taskCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_TASKS).listIndexes().toArray();
        for (const expect of INDEXES_TASKS) {
            const actual = _.find(taskCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }

    });

    it(`create indexes defined in both base and sub entity`, async () => {
        const result = await driver.createIndexes([
            SubEntity
        ], true);

        const subCollectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_SUB);
        assert.strictEqual(subCollectionResult.nIndexesBefore, 1);
        assert.strictEqual(subCollectionResult.nIndexesAfter, 3);
        const subCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_SUB).listIndexes().toArray();
        for (const expect of BASE_INDEXES) {
            const actual = _.find(subCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }
        for (const expect of SUB_INDEXES) {
            const actual = _.find(subCollectionIndexes, x => _.isEqual(x.key, expect.key));
            assert.ok(actual);
            assert.strictEqual(actual.name, expect.name);
            assert.strictEqual(actual.unique, expect.unique);
            assert.strictEqual(actual.background, expect.background);
        }
    });

    it(`indexes defined in simple mode`, async () => {
        const result = await driver.createIndexes([
            SimpleIndexEntity
        ], true);

        const collectionResult = _.find(result.collections, x => x.name === COLLECTION_NAME_SIMPLE);
        assert.strictEqual(collectionResult.nIndexesBefore, 1);
        assert.strictEqual(collectionResult.nIndexesAfter, INDEXES_SIMPLE.length + 1);
        const simpleCollectionIndexes = await client.db(dbName).collection(COLLECTION_NAME_SIMPLE).listIndexes().toArray();
        for (const expect of INDEXES_SIMPLE) {
            const actual = _.find(simpleCollectionIndexes, x => _.isEqual(x.key, expect));
            assert.ok(actual);
            assert.ok(actual.name);
            assert.isUndefined(actual.unique);
            assert.isUndefined(actual.background);
        }
    });

});