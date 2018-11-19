import { Context } from "./context";
import { HttpMethod } from "../constants";
interface INextFunction {
    (error?: any): Promise<void>;
}
interface RouterMiddleware<TContext extends Context<TState>, TState> {
    (ctx: TContext): Promise<void>;
}
interface RouterHandler<TContext extends Context<TState>, TState> {
    (ctx: TContext): Promise<any>;
}
declare abstract class Router<TContext extends Context<TState>, TState> {
    private _prefix;
    readonly prefix: string;
    abstract proxy: boolean;
    constructor(prefix?: string);
    use(handler: RouterMiddleware<TContext, TState>): void;
    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;
    route(method: HttpMethod, path: string, ...handlers: RouterHandler<TContext, TState>[]): void;
    protected abstract onRoute(method: HttpMethod, path: string, ...handlers: RouterHandler<TContext, TState>[]): void;
}
export { Router, INextFunction, RouterMiddleware, RouterHandler };
