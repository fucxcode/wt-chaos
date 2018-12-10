import { Context } from "./context";
import { INextFunction } from "./next-function";

export interface RouterMiddleware<TContext extends Context<TState>, TState> {

    (ctx: TContext, next: INextFunction): Promise<void>;

}