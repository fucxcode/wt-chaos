import { Entity, Id } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";

class FindByIdsPluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T>[]> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public ids: Id[],
        public condition?: any,
        public options?: FindOptions<T, TSession>
    ) {
        super(operationDescription, collectionName, driverName, "findByIds", []);
    }

}

export { FindByIdsPluginContext };