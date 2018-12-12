import { App } from "./app";
import { MongoDBDriver, DriverExtensions, ReadWriteStrategy } from "../src/repository";
import { MongoClient } from "mongodb";
import { PingFacade } from "./modules/ping/ping.facade";
import { config } from "./config";
import { ProductFacade } from "./modules/product/product.facade";

const app = new App([
    PingFacade,
    ProductFacade
]);

(async () => {
    // connect mongodb database
    const client = await MongoClient.connect(config.mongodb.url, {
        useNewUrlParser: true
    });
    const driver = new MongoDBDriver(client, config.mongodb.dbName, undefined, undefined, ReadWriteStrategy.AGGREGATE_SECONDARY);
    DriverExtensions.setDefault(driver);
    // start api server
    return await app.start();
})().then(result => {
    console.log(`application started at port ${result.port}`);
}).catch(error => {
    console.error(error);
});

export default app;