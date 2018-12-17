import { RouterContext } from "./router-context";
import { OperationContext } from "./operation-context";
import { OperationDescription } from "../repository";

export interface RouterContextHandler<TContext extends RouterContext<TState>, TState extends OperationContext> {

    (ctx: TContext): Promise<any>;

}

export class RouterRequest<T extends OperationContext> {

    private _operationContext: T;
    public get operationContext(): T {
        return this._operationContext;
    }
    public set operationContext(value: T) {
        this._operationContext = value;
    }

    public get operationDescription(): OperationDescription {
        return OperationDescription.from(this._operationContext);
    }

    constructor(ctx?: RouterContext<T>) {
        this._operationContext = ctx ? ctx.operationContext : {} as T;
    }

}

export interface RouterRequestHandler<T extends OperationContext> {

    (request: RouterRequest<T>): Promise<any>;

}

export interface RouterRequestConstructor<T extends OperationContext, TRequest extends RouterRequest<T>> {

    new(ctx?: RouterContext<T>): TRequest;

}