import * as TypeMoq from "typemoq";
import * as mongodb from "mongodb";
import { MongoDBDriver, MongoDBSession, MongoDBId, ReadWriteStrategy, ReadPreference } from "../src/repository/drivers";
import { Entity } from "../src/repository/entities";
import { Repository, Plugin, OperationDescription, ReadWriteStrategyPlugin, collectionName } from "../src/repository";
import * as _ from "../src/utilities";
import * as uuid from "node-uuid";

describe("read write strategy", () => {

    @collectionName("__test_collection__")
    // @ts-ignore
    class TestEntity implements Entity {
        _id: MongoDBId;
        name?: string;
    }

    class TestRepository extends Repository<MongoDBSession, MongoDBId, MongoDBDriver, TestEntity> {

        constructor(driverProvider: () => MongoDBDriver, plugins: Plugin[] = []) {
            super(TestEntity, driverProvider, plugins);
        }

    }

    const getRepoDriverAndMocks = function (strategy?: ReadWriteStrategy, plugins: Plugin[] = []): {
        clientMock: TypeMoq.IMock<mongodb.MongoClient>,
        dbMock: TypeMoq.IMock<mongodb.Db>,
        collectionMock: TypeMoq.IMock<mongodb.Collection<any>>,
        driver: MongoDBDriver,
        repository: TestRepository
    } {
        const client = TypeMoq.Mock.ofType<mongodb.MongoClient>(undefined, TypeMoq.MockBehavior.Strict);
        const db = TypeMoq.Mock.ofType<mongodb.Db>(undefined, TypeMoq.MockBehavior.Strict);
        const collection = TypeMoq.Mock.ofType<mongodb.Collection<any>>(undefined, TypeMoq.MockBehavior.Strict);

        client.setup(x => x.db(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => db.object).verifiable();
        db.setup(x => x.collection(TypeMoq.It.isAny())).returns(() => collection.object).verifiable();

        const driver = new MongoDBDriver(client.object, "__test_db__", undefined, undefined, strategy);
        const repository = new TestRepository(() => driver, plugins);
        return {
            clientMock: client,
            dbMock: db,
            collectionMock: collection,
            driver: driver,
            repository: repository
        };
    };

    const test = (strategyDriver?: ReadWriteStrategy, strategyPlugin?: ReadWriteStrategyPlugin, repoReadPreference?: ReadPreference,
        expectReadPreference?: mongodb.ReadPreference | string,
        expectAggregatePreference?: mongodb.ReadPreference | string,
        expectMapReducePreference?: mongodb.ReadPreference | string) => {

        it(`count`, async () => {
            const { clientMock, dbMock, collectionMock, driver, repository } = getRepoDriverAndMocks(strategyDriver, strategyPlugin && [strategyPlugin]);
            const od = new OperationDescription(uuid.v4());

            collectionMock.setup(x => x.countDocuments(
                TypeMoq.It.isAny(),
                TypeMoq.It.is<mongodb.MongoCountPreferences>(p => expectReadPreference ? p.readPreference === expectReadPreference : _.isUndefined(p.readPreference))))
                .verifiable();
            await repository.count(od, undefined, repoReadPreference ? {
                readPreference: repoReadPreference
            } : {});

            collectionMock.verifyAll();
        });

        const testFind = async<T>(action: (repo: TestRepository, od: OperationDescription, col: TypeMoq.IMock<mongodb.Collection<any>>, cur: TypeMoq.IMock<mongodb.Cursor<any>>) => Promise<T>): Promise<T> => {
            const { clientMock, dbMock, collectionMock, driver, repository } = getRepoDriverAndMocks(strategyDriver, strategyPlugin && [strategyPlugin]);

            const cursorMock = TypeMoq.Mock.ofType<mongodb.Cursor<any>>(undefined, TypeMoq.MockBehavior.Strict);
            cursorMock.setup(x => x.limit(TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable(TypeMoq.Times.atMostOnce());
            cursorMock.setup(x => x.maxTimeMS(TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable(TypeMoq.Times.atMostOnce());
            if (expectReadPreference) {
                cursorMock.setup(x => x.setReadPreference(TypeMoq.It.is<string | mongodb.ReadPreference>(p => p === expectReadPreference))).returns(() => cursorMock.object).verifiable();
            }
            else {
                cursorMock.setup(x => x.setReadPreference(TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable(TypeMoq.Times.never());
            }
            cursorMock.setup(x => x.toArray()).returns(() => Promise.resolve([])).verifiable();
            cursorMock.setup(x => x.sort(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable(TypeMoq.Times.atMostOnce());
            collectionMock.setup(x => x.find(TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable();

            const result = await action(repository, new OperationDescription(uuid.v4()), collectionMock, cursorMock);

            collectionMock.verifyAll();
            cursorMock.verifyAll();

            return result;
        };

        it(`findOne`, async () => {
            testFind(async (repo, od) => await repo.findOne(od, undefined, undefined, repoReadPreference ? {
                readPreference: repoReadPreference
            } : {}));
        });

        it(`findOneById`, async () => {
            testFind(async (repo, od) => await repo.findOneById(od, new MongoDBId(), undefined, repoReadPreference ? {
                readPreference: repoReadPreference
            } : {}));
        });

        it(`findByIds`, async () => {
            testFind(async (repo, od) => await repo.findByIds(od, [new MongoDBId(), new MongoDBId(), new MongoDBId()], undefined, repoReadPreference ? {
                readPreference: repoReadPreference
            } : {}));
        });

        it(`findByPageIndex`, async () => {
            testFind(async (repo, od, collectionMock, cursorMock) => {
                collectionMock.setup(x => x.countDocuments(
                    TypeMoq.It.isAny(),
                    TypeMoq.It.is<mongodb.MongoCountPreferences>(p => expectReadPreference ? p.readPreference === expectReadPreference : _.isUndefined(p.readPreference))))
                    .verifiable();
                return await repo.findByPageIndex(od, undefined, undefined, undefined, repoReadPreference ? {
                    readPreference: repoReadPreference
                } : {});
            });
        });

        it(`findByPageNext`, async () => {
            testFind(async (repo, od) => await repo.findByPageNext(od, undefined, undefined, undefined, repoReadPreference ? {
                readPreference: repoReadPreference
            } : {}));
        });

        it(`aggregate`, async () => {
            const { clientMock, dbMock, collectionMock, driver, repository } = getRepoDriverAndMocks(strategyDriver, strategyPlugin && [strategyPlugin]);
            const od = new OperationDescription(uuid.v4());

            const cursorMock = TypeMoq.Mock.ofType<mongodb.AggregationCursor<any>>(undefined, TypeMoq.MockBehavior.Strict);
            cursorMock.setup(x => x.toArray()).returns(() => Promise.resolve([])).verifiable();
            collectionMock.setup(x => x.aggregate(
                TypeMoq.It.isAny(),
                TypeMoq.It.is<mongodb.CollectionAggregationOptions>(o => expectAggregatePreference ? o.readPreference === expectAggregatePreference : _.isUndefined(o.readPreference))))
                .returns(() => cursorMock.object)
                .verifiable();
            await repository.aggregate(od, [], repoReadPreference ? {
                readPreference: repoReadPreference
            } : {});

            collectionMock.verifyAll();
            cursorMock.verifyAll();
        });

        it(`map reduce`, async () => {
            const { clientMock, dbMock, collectionMock, driver, repository } = getRepoDriverAndMocks(strategyDriver, strategyPlugin && [strategyPlugin]);
            const od = new OperationDescription(uuid.v4());

            collectionMock.setup(x => x.mapReduce(
                TypeMoq.It.isAny(), TypeMoq.It.isAny(),
                TypeMoq.It.is<mongodb.MapReduceOptions>(o => expectMapReducePreference ? o.readPreference === expectMapReducePreference : _.isUndefined(o.readPreference))))
                .verifiable();
            await repository.mapReduce(od, "", "", repoReadPreference ? {
                readPreference: repoReadPreference
            } : {});

            collectionMock.verifyAll();
        });
    };

    describe("strategy: driver - no, plugin - no, repo - no. read preference: read - no, aggregate - no, map reduce - no", () => {

        test();

    });

    describe("strategy: driver - primary, plugin - no, repo - no. read preference: read - primary, aggregate - primary, map reduce - primary", () => {

        test(ReadWriteStrategy.PRIMARY, undefined, undefined,
            mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY);

    });

    describe("strategy: driver - read secondary, plugin - no, repo - no. read preference: read - secondary, aggregate - secondary, map reduce - secondary", () => {

        test(ReadWriteStrategy.READ_SECONDARY, undefined, undefined,
            mongodb.ReadPreference.SECONDARY_PREFERRED, mongodb.ReadPreference.SECONDARY_PREFERRED, mongodb.ReadPreference.SECONDARY_PREFERRED);

    });

    describe("strategy: driver - aggregate secondary, plugin - no, repo - no. read preference: read - primary, aggregate - secondary, map reduce - secondary", () => {

        test(ReadWriteStrategy.AGGREGATE_SECONDARY, undefined, undefined,
            mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.SECONDARY_PREFERRED, mongodb.ReadPreference.SECONDARY_PREFERRED);

    });

    describe("strategy: driver - aggregate secondary, plugin - primary, repo - no. read preference: read - primary, aggregate - primary, map reduce - primary", () => {

        test(ReadWriteStrategy.AGGREGATE_SECONDARY, ReadWriteStrategyPlugin.PRIMARY, undefined,
            mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY);

    });

    describe("strategy: driver - aggregate secondary, plugin - read secondary, repo - no. read preference: read - secondary, aggregate - secondary, map reduce - secondary", () => {

        test(ReadWriteStrategy.AGGREGATE_SECONDARY, ReadWriteStrategyPlugin.READ_SECONDARY, undefined,
            mongodb.ReadPreference.SECONDARY_PREFERRED, mongodb.ReadPreference.SECONDARY_PREFERRED, mongodb.ReadPreference.SECONDARY_PREFERRED);

    });

    describe("strategy: driver - aggregate secondary, plugin - read secondary, repo - primary. read preference: read - primary, aggregate - primary, map reduce - primary", () => {

        test(ReadWriteStrategy.AGGREGATE_SECONDARY, ReadWriteStrategyPlugin.READ_SECONDARY, ReadPreference.primary,
            mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY, mongodb.ReadPreference.PRIMARY);

    });

});