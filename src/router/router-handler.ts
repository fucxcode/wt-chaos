import { Context } from "./context";

export interface RouterHandler<TContext extends Context<TState>, TState> {

    (ctx: TContext): Promise<any>;

}