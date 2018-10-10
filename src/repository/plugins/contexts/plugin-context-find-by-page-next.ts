import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { Repository } from "../../repository";
import { FindByPageNextResult } from "../../find-by-page-next-result";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";

class FindByPageNextPluginContext<T extends Entity, TSession extends Session> extends PluginContext<FindByPageNextResult<T>> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public condition: any,
        public pageIndex: number,
        public pageSize: number,
        public options: FindOptions<T, TSession>
    ) {
        super(operationDescription, collectionName, driverName, "findByPageNext", new FindByPageNextResult<T>([], pageIndex, pageSize, false));
    }

}

export { FindByPageNextPluginContext };