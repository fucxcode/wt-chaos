import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { AggregateOptions } from "../../drivers/aggregate-options";
import { Session } from "../../drivers";

class AggregatePluginContext<TResult, TSession extends Session> extends PluginContext<Partial<TResult>[]> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public pipeline: any[], 
        public options?: AggregateOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "aggregate", []);
    }

}

export { AggregatePluginContext };