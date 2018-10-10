import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { Id, Entity } from "../../entities";
import { UpdateOptions } from "../../drivers/update-options";
import { is } from "../../../constants";
import { Session } from "../../drivers";

class UpdateByIdPluginContext<TSession extends Session> extends PluginContext<UpdateResult> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public id: Id, 
        public condition?: any, 
        public update?: any, 
        public options?: UpdateOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "updateById", {
            ok: is.yes,
            n: 0,
            nModified: 0
        });
    }

}

export { UpdateByIdPluginContext };