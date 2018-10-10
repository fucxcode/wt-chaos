import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { CountOptions, Session } from "../../drivers";

class CountPluginContext<TSession extends Session> extends PluginContext<number> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public condition?: any,
        public options?: CountOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "count", 0);
    }

}

export { CountPluginContext };