import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { InsertManyOptions, InsertOneOptions, Session } from "../../drivers";

class InsertManyPluginContext<T extends Entity, TSession extends Session> extends PluginContext<Partial<T>[] | undefined> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public entities: T[],
        public options?: InsertManyOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "insertMany", undefined);
    }

}

export { InsertManyPluginContext };