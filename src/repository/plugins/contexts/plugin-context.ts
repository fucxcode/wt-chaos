import { OperationDescription } from "../../operation-desc";
import { Repository } from "../../repository";
import * as _ from "../../../utilities";
import { Entity } from "../../entities";

class PluginContext<TResult> {

    private _operationDescription: OperationDescription;
    public get operationDescription(): OperationDescription {
        return this._operationDescription;
    }

    private _collectionName: string;
    public get collectionName(): string {
        return this._collectionName;
    }

    private _driverName: string;
    public get driverName(): string {
        return this._driverName;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _cancel: boolean;
    public get cancel(): boolean {
        return this._cancel;
    }
    public set cancel(value: boolean) {
        this._cancel = value;
    }

    private _result: TResult;
    public get result(): TResult {
        return this._result;
    }
    public set result(value: TResult) {
        this._result = value;
    }

    private _properties: Map<string, any>;

    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, name: string, defaultResult: TResult) {
        this._operationDescription = operationDescription;
        this._collectionName = collectionName;
        this._driverName = driverName;
        this._name = name;
        this._properties = new Map<string, any>();

        this._cancel = false;
        this._result = defaultResult;
    }

    public setProperty<T>(key: string, value: T): void {
        this._properties.set(key, value);
    }

    public getProperty<T>(key: string): T {
        return this._properties.get(key);
    }

    // public toObject(): Object {
    //     const obj: any = {};
    //     _.forOwn(this, (value, key) => {
    //         switch (key) {
    //             case `_name`:
    //                 obj.name = this._name;
    //                 break;
    //             case `_cancel`:
    //                 obj.cancel = this._cancel;
    //                 break;
    //             case `_collectionName`:
    //                 obj.collectionName = this._collectionName;
    //                 break;
    //             case `_driverName`:
    //                 obj.driverName = this._driverName;
    //                 break;
    //             case `_oid`:
    //                 obj.oid = this._oid;
    //                 break;
    //             case `_properties`:
    //                 obj.properties = this._properties;
    //             default:
    //                 obj[key] = value;
    //                 break;
    //         }
    //     });
    //     return obj;
    // }
}

export { PluginContext };