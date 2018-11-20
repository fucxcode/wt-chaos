import { Context } from "./context";
import { HttpMethod } from "../constants";
import { Container } from "../container";
interface INextFunction {
    (error?: any): Promise<void>;
}
interface RouterMiddleware<TContext extends Context<TState>, TState> {
    (ctx: TContext, next: INextFunction): Promise<void>;
}
interface RouterHandler<TContext extends Context<TState>, TState> {
    (ctx: TContext): Promise<any>;
}
declare const DEFAULT_ROUTER_KEY: unique symbol;
declare abstract class Router<TContext extends Context<TState>, TState> {
    private _prefix;
    readonly prefix: string;
    abstract proxy: boolean;
    constructor(prefix?: string, isDefault?: boolean, container?: Container);
    use(handler: RouterMiddleware<TContext, TState>): void;
    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;
    route(method: HttpMethod, path: string, middlewares: RouterMiddleware<TContext, TState>[], handler: RouterHandler<TContext, TState>): void;
    protected abstract onRoute(method: HttpMethod, path: string, middlewares: RouterMiddleware<TContext, TState>[], handler: RouterHandler<TContext, TState>): void;
    setDefault(container?: Container | undefined): void;
}
export { Router, INextFunction, RouterMiddleware, RouterHandler, DEFAULT_ROUTER_KEY };
