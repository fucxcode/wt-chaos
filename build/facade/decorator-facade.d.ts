import { Router, Context } from "../router";
import { Container } from "../container";
declare const facade: <TContext extends Context<TState>, TState>(router?: Router<TContext, TState> | undefined, container?: Container | undefined) => (target: any) => any;
export { facade };
