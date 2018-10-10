import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";

class FindOnePluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T> | undefined> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public condition?: any,
        public options?: FindOptions<T, TSession>
    ) {
        super(operationDescription, collectionName, driverName, "findOne", undefined);
    }

}

export { FindOnePluginContext };