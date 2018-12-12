import { Id } from "../../src/repository";
import { UID } from "../../src/constants";

export interface OperationContext {

    oid?: string;

    team?: Id;

    uid?: UID;

    path?: string;

}