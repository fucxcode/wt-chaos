import { Router, Context } from "../router";
declare const facade: <TContext extends Context<TState>, TState>(router: Router<TContext, TState>) => (target: any) => any;
export { facade };
