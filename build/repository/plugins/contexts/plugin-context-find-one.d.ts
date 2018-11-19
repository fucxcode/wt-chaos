import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";
declare class FindOnePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {
    condition?: any;
    options?: FindOptions<T, TSession> | undefined;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, condition?: any, options?: FindOptions<T, TSession> | undefined);
}
export { FindOnePluginContext };
