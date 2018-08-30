import { Context } from "./context";
interface INextFunction {
    (error?: any): Promise<void>;
}
interface RouterMiddleware<TContext extends Context<TState>, TState> {
    (ctx: TContext): void;
}
interface RouterHandler<TContext extends Context<TState>, TState> {
    (ctx: TContext): void;
}
declare abstract class Router<TContext extends Context<TState>, TState> {
    private _prefix;
    readonly prefix: string;
    constructor(prefix?: string);
    use(handler: RouterMiddleware<TContext, TState>): void;
    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;
    route(method: string, path: string, handler: RouterHandler<TContext, TState>): void;
    protected abstract onRoute(method: string, path: string, handler: RouterHandler<TContext, TState>): void;
}
export { Router, INextFunction, RouterMiddleware, RouterHandler };
