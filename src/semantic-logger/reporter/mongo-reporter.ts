import { Reporter, Querier } from "./interfaces";
import { OutPut } from "../controller";
import { MongoDBDriver, InsertOneOptions, MongoDBSession, DriverExtensions } from "../../repository";

class MongoReport implements Reporter, Querier {
    private _driverProvider: () => MongoDBDriver;

    public get driver(): MongoDBDriver {
        return this._driverProvider();
    }

    public collection: string;
    public insertOptions: InsertOneOptions<MongoDBSession> | undefined;

    // // TODO: make driver optional; if true, pull an instance from container
    constructor(
        collection: string,
        driverProvider?: () => MongoDBDriver,
        insertOpts?: InsertOneOptions<MongoDBSession>
    ) {
        this.collection = collection;
        this.insertOptions = insertOpts;
        this._driverProvider = driverProvider || DriverExtensions.getDefault;
    }

    public async report<T>(entity: OutPut<T>): Promise<OutPut<T>> {
        const result = await this.driver.insertOne(this.collection, entity, this.insertOptions);
        return result as Promise<OutPut<T>>;
    }

    public async query<T>(filter: object): Promise<Partial<T>[]> {
        return this.driver.find<T>(this.collection, Object.assign({}, filter));
    }
}

export { MongoReport };
