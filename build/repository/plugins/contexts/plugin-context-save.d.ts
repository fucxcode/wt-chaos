import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { InsertManyOptions, InsertOneOptions, Session } from "../../drivers";
declare class SavePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | Partial<T>[] | undefined> {
    entityOrArray: T | T[];
    options?: InsertOneOptions<TSession> | InsertManyOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, entityOrArray: T | T[], options?: InsertOneOptions<TSession> | InsertManyOptions<TSession> | undefined);
}
export { SavePluginContext };
