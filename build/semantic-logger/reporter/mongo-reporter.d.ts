import { Reporter, Querier } from "./interfaces";
import { OutPut } from "../controller";
import { MongoDBDriver, InsertOneOptions, MongoDBSession } from "../../repository";
declare class MongoReport implements Reporter, Querier {
    private _driverProvider;
    readonly driver: MongoDBDriver;
    collection: string;
    insertOptions: InsertOneOptions<MongoDBSession> | undefined;
    constructor(collection: string, driverProvider?: () => MongoDBDriver, insertOpts?: InsertOneOptions<MongoDBSession>);
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
    query<T>(filter: object): Promise<Partial<T>[]>;
}
export { MongoReport };
