import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { InsertManyOptions, InsertOneOptions, Session } from "../../drivers";

class InsertOnePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T>| undefined> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public entity: T,
        public options?: InsertOneOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "insertOne", undefined);
    }

}

export { InsertOnePluginContext };