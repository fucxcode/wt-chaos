import { Context } from "./context";
import * as $path from "path";

interface INextFunction {

    (error?: any): Promise<void>;

}

interface RouterMiddleware<TContext extends Context<TState>, TState> {

    (ctx: TContext): void;

}

interface RouterHandler<TContext extends Context<TState>, TState> {

    (ctx: TContext): void;

}

abstract class Router<TContext extends Context<TState>, TState> {

    private _prefix: string;
    public get prefix(): string {
        return this._prefix;
    }

    constructor(prefix: string = "") {
        this._prefix = prefix;
    }

    public use(handler: RouterMiddleware<TContext, TState>): void {
        this.onUse(handler);
    }

    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;

    public route(method: string, path: string, handler: RouterHandler<TContext, TState>): void {
        this.onRoute(method, $path.join(this._prefix, path), handler);
    }

    protected abstract onRoute(method: string, path: string, handler: RouterHandler<TContext, TState>): void;

}

export { Router, INextFunction, RouterMiddleware, RouterHandler };