import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { UpdateOptions } from "../../drivers/update-options";
import { Is } from "../../../constants";
import { Entity } from "../../entities";
import { Session } from "../../drivers";

class UpdatePluginContext<TSession extends Session> extends PluginContext<UpdateResult> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public condition?: any, 
        public update?: any, 
        public options?: UpdateOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "update", {
            ok: Is.yes,
            n: 0,
            nModified: 0
        });
    }

}

export { UpdatePluginContext };