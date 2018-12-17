import { App } from "./app";
import { MongoDBDriver, DriverExtensions, ReadWriteStrategy } from "../src/repository";
import { MongoClient } from "mongodb";
import { PingFacade } from "./modules/ping/ping.facade";
import { config } from "./config";
import MongoMemoryServer from "mongodb-memory-server";
import { TeamFacade } from "./modules/team/team.facade";

const app = new App([
    PingFacade,
    TeamFacade
]);

(async () => {
    // start mongodb memory server
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    const dbName = await mongod.getDbName();

    // connect mongodb database
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true
    });
    const driver = new MongoDBDriver(client, dbName, undefined, undefined, ReadWriteStrategy.AGGREGATE_SECONDARY);
    DriverExtensions.setDefault(driver);
    // start api server
    return await app.start();
})().then(result => {
    console.log(`application started at port ${result.port}`);
}).catch(error => {
    console.error(error);
});

export default app;