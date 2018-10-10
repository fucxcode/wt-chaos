import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOneAndUpdateOptions } from "../../drivers/find-one-update-options";
import { Session } from "../../drivers";
declare class FindOneAndUpdateByEntityPluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {
    entity: T;
    condition?: any;
    options?: FindOneAndUpdateOptions<T, TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, entity: T, condition?: any, options?: FindOneAndUpdateOptions<T, TSession> | undefined);
}
export { FindOneAndUpdateByEntityPluginContext };
