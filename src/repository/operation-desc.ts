import { Id } from "./entities";
import { UID } from "../constants";
import * as uuid from "node-uuid";

interface OperationContextLike {

    oid?: string;

    team?: Id;

    uid?: UID;

    path?: string;

}

class OperationDescription {

    private _oid: string;
    public get oid(): string {
        return this._oid;
    }

    private _team?: Id;
    public get team(): Id | undefined {
        return this._team;
    }

    private _uid?: UID;
    public get uid(): UID | undefined {
        return this._uid;
    }

    private _path?: string;
    public get path(): string | undefined {
        return this._path;
    }

    constructor(oid: string = uuid.v4(), team?: Id, uid?: UID, path?: string) {
        this._oid = oid;
        this._team = team;
        this._uid = uid;
        this._path = path;
    }

    public static from(operationContext: OperationContextLike): OperationDescription {
        return new OperationDescription(operationContext.oid, operationContext.team, operationContext.uid, operationContext.path);
    }

}

export { OperationDescription, OperationContextLike };