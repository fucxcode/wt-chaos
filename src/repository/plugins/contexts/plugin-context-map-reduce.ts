import { PluginContext } from "./plugin-context";
import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import { MapReduceOptions } from "../../drivers/map-reduce-options";
import { Entity } from "../../entities";
import { Session } from "../../drivers";

class MapReducePluginContext<TResult, TSession extends Session> extends PluginContext<Partial<TResult>[]> {

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string,
        public map: Function | string, 
        public reduce: Function | string, 
        public options?: MapReduceOptions<TSession>
    ) {
        super(operationDescription, driverName, collectionName, "mapReduce", []);
    }

}

export { MapReducePluginContext };