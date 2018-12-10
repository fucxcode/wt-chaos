import { Context } from "./context";
import * as $path from "path";
import { HttpMethod } from "../constants";
import { Container, ContainerPool } from "../container";
import { RouterMiddleware } from "./router-middleware";
import { RouterHandler } from "./router-handler";

const DEFAULT_ROUTER_KEY = Symbol.for("default_router");

abstract class Router<TContext extends Context<TState>, TState> {

    private _prefix: string;
    public get prefix(): string {
        return this._prefix;
    }

    public abstract get proxy(): boolean;
    public abstract set proxy(value: boolean);

    constructor(prefix: string = "", isDefault: boolean = true, container?: Container) {
        this._prefix = prefix;
        if (isDefault) {
            this.setDefault(container);
        }
    }

    public use(handler: RouterMiddleware<TContext, TState>): void {
        this.onUse(handler);
    }

    protected abstract onUse(handler: RouterMiddleware<TContext, TState>): void;

    public route(method: HttpMethod, path: string, middlewares: RouterMiddleware<TContext, TState>[], handler: RouterHandler<TContext, TState>): void {
        this.onRoute(method, $path.join(this._prefix, path), middlewares, handler);
    }

    protected abstract onRoute(method: HttpMethod, path: string, middlewares: RouterMiddleware<TContext, TState>[], handler: RouterHandler<TContext, TState>): void;

    public setDefault(container: Container | undefined = ContainerPool.getDefaultContainer()): void {
        if (container) {
            const c = container;
            c.registerInstance(DEFAULT_ROUTER_KEY, this);
        }
        else {
            throw new Error("cannot specify default router without default container");
        }
    }

}

export { Router, DEFAULT_ROUTER_KEY };