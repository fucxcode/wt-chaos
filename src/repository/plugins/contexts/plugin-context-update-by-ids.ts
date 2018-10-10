import { PluginContext } from "./plugin-context";
import { UpdateResult } from "../../drivers/update-result";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { Id, Entity } from "../../entities";
import { UpdateOptions } from "../../drivers/update-options";
import { is } from "../../../constants";
import { Session } from "../../drivers";

class UpdateByIdsPluginContext<TSession extends Session> extends PluginContext<UpdateResult> {

    constructor(operationDescription: OperationDescription, collectionName: string, driverName: string,
        public ids: Id[],
        public condition?: any,
        public update?: any,
        public options?: UpdateOptions<TSession>
    ) {
        super(operationDescription, collectionName, driverName, "updateByIds", {
            ok: is.yes,
            n: 0,
            nModified: 0
        });
    }

}

export { UpdateByIdsPluginContext };