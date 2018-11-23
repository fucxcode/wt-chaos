import { Reporter } from "./interfaces";
import { OutPut } from "../controller";
import { MongoDBDriver, InsertOneOptions, MongoDBSession } from "../../repository";

class MongoReport implements Reporter {
    public driver: MongoDBDriver;
    public collection: string;
    public insertOptions: InsertOneOptions<MongoDBSession> | undefined;

    // TODO: make driver optional; if true, pull an instance from container
    constructor(driver: MongoDBDriver, collection: string, insertOpts?: InsertOneOptions<MongoDBSession>) {
        this.driver = driver;
        this.collection = collection;
        this.insertOptions = insertOpts;
    }

    public async report<T>(entity: OutPut<T>): Promise<OutPut<T>> {
        const result = await this.driver.insertOne(this.collection, entity, this.insertOptions);
        return result as Promise<OutPut<T>>;
    }
}

export { MongoReport };
