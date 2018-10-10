import { Entity, Id } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";
declare class FindByIdsPluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T>[]> {
    ids: Id[];
    condition?: any;
    options?: FindOptions<T, TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, ids: Id[], condition?: any, options?: FindOptions<T, TSession> | undefined);
}
export { FindByIdsPluginContext };
