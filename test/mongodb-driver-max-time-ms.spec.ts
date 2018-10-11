import * as TypeMoq from "typemoq";
import * as mongodb from "mongodb";
import { MongoDBDriver } from "../src/repository/drivers";
import * as _ from "../src/utilities";

describe("mongodb driver: force set max-time-ms", () => {

    const getDriverAndMocks = function (databaseName: string, defaultOpTimeMs: number, maxOpTimeMs: number): {
        clientMock: TypeMoq.IMock<mongodb.MongoClient>,
        dbMock: TypeMoq.IMock<mongodb.Db>,
        collectionMock: TypeMoq.IMock<mongodb.Collection<any>>,
        driver: MongoDBDriver
    } {
        const client = TypeMoq.Mock.ofType<mongodb.MongoClient>(undefined, TypeMoq.MockBehavior.Strict);
        const db = TypeMoq.Mock.ofType<mongodb.Db>(undefined, TypeMoq.MockBehavior.Strict);
        const collection = TypeMoq.Mock.ofType<mongodb.Collection<any>>(undefined, TypeMoq.MockBehavior.Strict);

        client.setup(x => x.db(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => db.object).verifiable();
        db.setup(x => x.collection(TypeMoq.It.isAny())).returns(() => collection.object).verifiable();

        const driver = new MongoDBDriver(client.object, databaseName, defaultOpTimeMs, maxOpTimeMs);
        return {
            clientMock: client,
            dbMock: db,
            collectionMock: collection,
            driver: driver
        };
    };

    it(`count: no "options.maxTimeMS". default less than max. use default`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs - 1;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === defaultOpTimeMs))).verifiable();
        await driver.count("__coll__", undefined);

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`count: no "options.maxTimeMS". default equals max. use default`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === defaultOpTimeMs))).verifiable();

        await driver.count("__coll__", undefined);

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`count: no "options.maxTimeMS". default greater than max. use max`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs + 1;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === maxOpTimeMs))).verifiable();

        await driver.count("__coll__", undefined);

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`count: options.maxTimeMS less than max. default greater than max. use options`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs + 1;
        const opTimeMs = maxOpTimeMs - 1;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === opTimeMs))).verifiable();

        await driver.count("__coll__", undefined, {
            maxTimeMS: opTimeMs
        });

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`count: options.maxTimeMS equals max. default greater than max. use options`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs + 1;
        const opTimeMs = maxOpTimeMs;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === opTimeMs))).verifiable();

        await driver.count("__coll__", undefined, {
            maxTimeMS: opTimeMs
        });

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`count: options.maxTimeMS greater than max. default greater than max. use max`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs + 1;
        const opTimeMs = maxOpTimeMs + 1;
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.countDocuments(TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.MongoCountPreferences>(p => p.maxTimeMS === maxOpTimeMs))).verifiable();

        await driver.count("__coll__", undefined, {
            maxTimeMS: opTimeMs
        });

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

    it(`find: options.maxTimeMS specified and used`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs - 1;
        const opTimeMs = _.random(1, maxOpTimeMs);
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        const cursorMock = TypeMoq.Mock.ofType<mongodb.Cursor<any>>(undefined, TypeMoq.MockBehavior.Strict);
        cursorMock.setup(x => x.maxTimeMS(TypeMoq.It.is(t => t === opTimeMs))).returns(() => cursorMock.object).verifiable();
        cursorMock.setup(x => x.toArray()).returns(async () => []).verifiable();
        collectionMock.setup(x => x.find(TypeMoq.It.isAny())).returns(() => cursorMock.object).verifiable();
        await driver.find("__coll__", undefined, {
            maxTimeMS: opTimeMs
        });

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
        cursorMock.verifyAll();
    });

    it(`findOneAndUpdate: options.maxTimeMS specified and used`, async () => {
        const maxOpTimeMs = 60000;
        const defaultOpTimeMs = maxOpTimeMs - 1;
        const opTimeMs = _.random(1, maxOpTimeMs);
        const { clientMock, dbMock, collectionMock, driver } = getDriverAndMocks("__test__", defaultOpTimeMs, maxOpTimeMs);

        collectionMock.setup(x => x.findOneAndUpdate(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.is<mongodb.FindOneAndReplaceOption>(p => p.maxTimeMS === opTimeMs))).returns(async () => {
            return {
                value: {}
            };
        }).verifiable();
        await driver.findOneAndUpdate("__coll__", undefined, {}, {
            maxTimeMS: opTimeMs
        });

        clientMock.verifyAll();
        dbMock.verifyAll();
        collectionMock.verifyAll();
    });

});