import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOneAndUpdateOptions } from "../../drivers/find-one-update-options";
import { Session } from "../../drivers";
declare class FindOneAndUpdatePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {
    condition?: any;
    update?: any;
    options?: FindOneAndUpdateOptions<T, TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, condition?: any, update?: any, options?: FindOneAndUpdateOptions<T, TSession> | undefined);
}
export { FindOneAndUpdatePluginContext };
