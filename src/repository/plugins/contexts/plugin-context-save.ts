import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { InsertManyOptions, InsertOneOptions, Session } from "../../drivers";

class SavePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | Partial<T>[] | undefined> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public entityOrArray: T | T[],
        public options?: InsertOneOptions<TSession> | InsertManyOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "save", undefined);
    }

}

export { SavePluginContext };