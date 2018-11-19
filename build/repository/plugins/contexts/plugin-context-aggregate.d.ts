import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { AggregateOptions } from "../../drivers/aggregate-options";
import { Session } from "../../drivers";
declare class AggregatePluginContext<TResult, TSession extends Session> extends PluginContext<Partial<TResult>[]> {
    pipeline: any[];
    options?: AggregateOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, pipeline: any[], options?: AggregateOptions<TSession> | undefined);
}
export { AggregatePluginContext };
