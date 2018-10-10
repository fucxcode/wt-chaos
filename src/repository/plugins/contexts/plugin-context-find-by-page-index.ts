import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { Repository } from "../../repository";
import { FindByPageIndexResult } from "../../find-by-page-index-result";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";

class FindByPageIndexPluginContext<T extends Entity, TSession extends Session> extends PluginContext<FindByPageIndexResult<T>> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public condition: any, 
        public pageIndex: number, 
        public pageSize: number, 
        public options: FindOptions<T, TSession>
    ) {
        super(operationDescription, collectionName, driverName, "findByPageIndex", new FindByPageIndexResult<T>([], pageIndex, pageSize, 0));
    }

}

export { FindByPageIndexPluginContext };