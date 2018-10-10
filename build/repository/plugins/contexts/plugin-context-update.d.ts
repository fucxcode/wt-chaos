import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { UpdateOptions } from "../../drivers/update-options";
import { Session } from "../../drivers";
declare class UpdatePluginContext<TSession extends Session> extends PluginContext<UpdateResult> {
    condition?: any;
    update?: any;
    options?: UpdateOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, condition?: any, update?: any, options?: UpdateOptions<TSession> | undefined);
}
export { UpdatePluginContext };
