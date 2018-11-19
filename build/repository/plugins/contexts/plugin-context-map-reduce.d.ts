import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { MapReduceOptions } from "../../drivers/map-reduce-options";
import { Session } from "../../drivers";
declare class MapReducePluginContext<TResult, TSession extends Session> extends PluginContext<Partial<TResult>[]> {
    map: Function | string;
    reduce: Function | string;
    options?: MapReduceOptions<TSession> | undefined;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions<TSession> | undefined);
}
export { MapReducePluginContext };
