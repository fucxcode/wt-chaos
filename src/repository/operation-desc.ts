import { Id } from "./entities";
import { UID } from "../constants";

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

    constructor(oid: string, team?: Id, uid?: UID, path?: string) {
        this._oid = oid;
        this._team = team;
        this._uid = uid;
        this._path = path;
    }

}

export { OperationDescription };