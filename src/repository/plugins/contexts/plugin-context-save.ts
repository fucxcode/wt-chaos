import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { InsertManyOptions, InsertOneOptions, Session } from "../../drivers";

class SavePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | Partial<T>[] | undefined> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public entityOrArray: T | T[],
        public options?: InsertOneOptions<TSession> | InsertManyOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "save", undefined);
    }

}

export { SavePluginContext };