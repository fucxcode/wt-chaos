import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { FindByPageNextResult } from "../../find-by-page-next-result";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";
declare class FindByPageNextPluginContext<T extends Entity, TSession extends Session> extends PluginContext<FindByPageNextResult<T>> {
    condition: any;
    pageIndex: number;
    pageSize: number;
    options: FindOptions<T, TSession>;
    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string, condition: any, pageIndex: number, pageSize: number, options: FindOptions<T, TSession>);
}
export { FindByPageNextPluginContext };
