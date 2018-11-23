import { IReporter } from "./interfaces";
import { OutPut } from "../controller";
import { MongoDBDriver, InsertOneOptions, MongoDBSession } from "../../repository";
declare class MongoReport implements IReporter {
    driver: MongoDBDriver;
    collection: string;
    insertOptions: InsertOneOptions<MongoDBSession> | undefined;
    constructor(driver: MongoDBDriver, collection: string, insertOpts?: InsertOneOptions<MongoDBSession>);
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}
export { MongoReport };
