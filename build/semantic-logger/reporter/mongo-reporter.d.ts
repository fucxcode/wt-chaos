import { Reporter } from "./interfaces";
import { OutPut } from "../controller";
import { MongoDBDriver, InsertOneOptions, MongoDBSession } from "../../repository";
declare class MongoReport implements Reporter {
    private _driverProvider;
    readonly driver: MongoDBDriver;
    collection: string;
    insertOptions: InsertOneOptions<MongoDBSession> | undefined;
    constructor(collection: string, driverProvider: () => MongoDBDriver, insertOpts?: InsertOneOptions<MongoDBSession>);
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}
export { MongoReport };
