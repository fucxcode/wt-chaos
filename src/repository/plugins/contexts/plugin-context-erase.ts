import { PluginContext } from "./plugin-context";
import { DeleteResult } from "../../drivers/delete-result";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { DeleteOptions } from "../../drivers/delete-options";
import { is } from "../../../constants";
import { Entity } from "../../entities";
import { Session } from "../../drivers/session";

class ErasePluginContext<TSession extends Session> extends PluginContext<DeleteResult> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public condition?: any,
        public options?: DeleteOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "erase", {
            ok: is.yes,
            n: 0
        });
    }

}

export { ErasePluginContext };