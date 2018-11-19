import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { Id } from "../../entities";
import { UpdateOptions } from "../../drivers/update-options";
import { Session } from "../../drivers";
declare class UpdateByIdPluginContext<TSession extends Session> extends PluginContext<UpdateResult> {
    id: Id;
    condition?: any;
    update?: any;
    options?: UpdateOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, id: Id, condition?: any, update?: any, options?: UpdateOptions<TSession> | undefined);
}
export { UpdateByIdPluginContext };
