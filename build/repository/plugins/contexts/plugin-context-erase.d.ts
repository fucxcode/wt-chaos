import { PluginContext } from "./plugin-context";
import { DeleteResult } from "../../drivers/delete-result";
import { OperationDescription } from "../../operation-desc";
import { DeleteOptions } from "../../drivers/delete-options";
import { Session } from "../../drivers/session";
declare class ErasePluginContext<TSession extends Session> extends PluginContext<DeleteResult> {
    condition?: any;
    options?: DeleteOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, condition?: any, options?: DeleteOptions<TSession> | undefined);
}
export { ErasePluginContext };
