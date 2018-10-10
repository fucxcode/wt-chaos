import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { UpdateOptions } from "../../drivers/update-options";
import { Session } from "../../drivers";
declare class UpdateByEntityPluginContext<T extends Entity, TSession extends Session> extends PluginContext<UpdateResult> {
    entity: T;
    condition?: any;
    options?: UpdateOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, entity: T, condition?: any, options?: UpdateOptions<TSession> | undefined);
}
export { UpdateByEntityPluginContext };
