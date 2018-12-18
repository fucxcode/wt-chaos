import { OperationContext } from "../operation-context";
import { OperationDescription } from "../../repository";
import { RouterContext } from "../router-context";
import { resolve } from "./decorator-resolve";

export class RouterRequest<T extends OperationContext> {

    @resolve<T>(ctx => ctx.operationContext)
    private _operationContext!: T;
    public get operationContext(): T {
        return this._operationContext;
    }
    public set operationContext(value: T) {
        this._operationContext = value;
    }

    public get operationDescription(): OperationDescription {
        return OperationDescription.from(this._operationContext);
    }

    constructor() {
    }

}