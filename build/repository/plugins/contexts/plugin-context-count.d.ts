import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { CountOptions, Session } from "../../drivers";
declare class CountPluginContext<TSession extends Session> extends PluginContext<number> {
    condition?: any;
    options?: CountOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, condition?: any, options?: CountOptions<TSession> | undefined);
}
export { CountPluginContext };
