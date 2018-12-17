import { Id } from "../repository";
import { UID } from "../constants";

export class OperationContext {

    private _oid?: string;
    public get oid(): string | undefined {
        return this._oid;
    }

    private _team?: Id;
    public get team(): Id | undefined {
        return this._team;
    }
    public set team(value: Id | undefined) {
        this._team = value;
    }

    private _uid?: UID;
    public get uid(): UID | undefined {
        return this._uid;
    }
    public set uid(value: UID | undefined) {
        this._uid = value;
    }

    private _path?: string;
    public get path(): string | undefined {
        return this._path;
    }

    constructor(oid?: string, team?: Id, uid?: UID, path?: string) {
        this._oid = oid;
        this._team = team;
        this._uid = uid;
        this._path = path;
    }

}