// import { OperationContext } from "../../src/router/operation-context";
// import { RouterContext } from "../../src/router";
// import { OperationDescription } from "../../src/repository";

// export abstract class ServiceRequest<T extends OperationContext> {

//     private _operationContext: T;
//     public get operationContext(): T {
//         return this._operationContext;
//     }
//     public set operationContext(value: T) {
//         this._operationContext = value;
//     }

//     public get operationDescription(): OperationDescription {
//         return OperationDescription.from(this._operationContext);
//     }

//     constructor(ctx?: RouterContext<T>) {
//         this._operationContext = ctx ? ctx.operationContext : {} as T;
//     }

// }