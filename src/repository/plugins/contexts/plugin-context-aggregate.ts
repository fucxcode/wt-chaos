import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { AggregateOptions } from "../../drivers/aggregate-options";
import { Session } from "../../drivers";

class AggregatePluginContext<TResult, TSession extends Session> extends PluginContext<Partial<TResult>[]> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public pipeline: any[], 
        public options?: AggregateOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "aggregate", []);
    }

}

export { AggregatePluginContext };