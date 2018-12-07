import MongoMemoryServer from "mongodb-memory-server";
import * as mongodb from "mongodb";
import { MongoDBDriver, collectionName, Id, indexes, Entity, getCollectionNameFromEntity, IndexSpecification } from "../src/repository";
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

});