import { Router, Context } from "../router";
import { IContainer } from "../container";
declare const facade: <TContext extends Context<TState>, TState>(router?: Router<TContext, TState> | undefined, container?: IContainer | undefined) => (target: any) => any;
export { facade };
