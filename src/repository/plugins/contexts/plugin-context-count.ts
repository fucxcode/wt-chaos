import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { CountOptions, Session } from "../../drivers";

class CountPluginContext<TSession extends Session> extends PluginContext<number> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public condition?: any,
        public options?: CountOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "count", 0);
    }

}

export { CountPluginContext };