import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { FindByPageIndexResult } from "../../find-by-page-index-result";
import { OperationDescription } from "../../operation-desc";
import { FindOptions } from "../../drivers/find-options";
import { Session } from "../../drivers";
declare class FindByPageIndexPluginContext<T extends Entity, TSession extends Session> extends PluginContext<FindByPageIndexResult<T>> {
    condition: any;
    pageIndex: number;
    pageSize: number;
    options: FindOptions<T, TSession>;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, condition: any, pageIndex: number, pageSize: number, options: FindOptions<T, TSession>);
}
export { FindByPageIndexPluginContext };
