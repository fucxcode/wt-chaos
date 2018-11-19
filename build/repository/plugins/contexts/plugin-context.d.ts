import { OperationDescription } from "../../operation-desc";
declare class PluginContext<TResult> {
    private _operationDescription;
    readonly operationDescription: OperationDescription;
    private _collectionName;
    readonly collectionName: string;
    private _driverName;
    readonly driverName: string;
    private _name;
    readonly name: string;
    private _cancel;
    cancel: boolean;
    private _result;
    result: TResult;
    private _properties;
    constructor(operationDescription: OperationDescription, driverName: string, collectionName: string, name: string, defaultResult: TResult);
    setProperty<T>(key: string, value: T): void;
    getProperty<T>(key: string): T;
}
export { PluginContext };
