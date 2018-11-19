import { Context } from "./context";
import * as $path from "path";
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

abstract class Router<TContext extends Context<TState>, TState> {

    private _prefix: string;
    public get prefix(): string {
        return this._prefix;
    }

    public abstract get proxy(): boolean;
    public abstract set proxy(value: boolean);

    constructor(prefix: string = "") {
        this._prefix = prefix;
    }

    public use(handler: RouterMiddleware<TContext, TState>): void {
        this.onUse(handler);
    }

    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;

    public route(method: HttpMethod, path: string, ...handlers: RouterHandler<TContext, TState>[]): void {
        this.onRoute(method, $path.join(this._prefix, path), ...handlers);
    }

    protected abstract onRoute(method: HttpMethod, path: string, ...handlers: RouterHandler<TContext, TState>[]): void;

}

export { Router, INextFunction, RouterMiddleware, RouterHandler };