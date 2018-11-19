import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { FindOneAndUpdateOptions } from "../../drivers/find-one-update-options";
import { Session } from "../../drivers";

class FindOneAndUpdateByEntityPluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public entity: T, 
        public condition?: any, 
        public options?: FindOneAndUpdateOptions<T, TSession>
    ) {
        super(operationDescription, driverName, collectionName, "findOneAndUpdateByEntity", undefined);
    }

}

export { FindOneAndUpdateByEntityPluginContext };