import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOneAndUpdateOptions } from "../../drivers/find-one-update-options";
import { Session } from "../../drivers";

class FindOneAndUpdatePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public condition?: any, 
        public update?: any, 
        public options?: FindOneAndUpdateOptions<T, TSession>
    ) {
        super(operationDescription, driverName, collectionName, "findOneAndUpdate", undefined);
    }

}

export { FindOneAndUpdatePluginContext };