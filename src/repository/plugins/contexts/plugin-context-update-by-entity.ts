import { Entity } from "../../entities";
import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { UpdateOptions } from "../../drivers/update-options";
import { Is } from "../../../constants";
import { Session } from "../../drivers";

class UpdateByEntityPluginContext<T extends Entity, TSession extends Session> extends PluginContext<UpdateResult> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public entity: T,
        public condition?: any,
        public options?: UpdateOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "updateByEntity", {
            ok: Is.yes,
            n: 0,
            nModified: 0
        });
    }

}

export { UpdateByEntityPluginContext };