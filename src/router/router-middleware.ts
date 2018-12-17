import { RouterContext } from "./router-context";
import { INextFunction } from "./next-function";
import { OperationContext } from "./operation-context";

export interface RouterMiddleware<TContext extends RouterContext<TState>, TState extends OperationContext> {

    (ctx: TContext, next: INextFunction): Promise<void>;

}