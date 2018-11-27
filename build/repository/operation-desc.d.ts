import { Id } from "./entities";
import { UID } from "../constants";
interface OperationContextLike {
    oid?: string;
    team?: Id;
    uid?: UID;
    path?: string;
}
declare class OperationDescription {
    private _oid;
    readonly oid: string;
    private _team?;
    readonly team: Id | undefined;
    private _uid?;
    readonly uid: UID | undefined;
    private _path?;
    readonly path: string | undefined;
    constructor(oid?: string, team?: Id, uid?: UID, path?: string);
    static from(operationContext: OperationContextLike): OperationDescription;
}
export { OperationDescription, OperationContextLike };
