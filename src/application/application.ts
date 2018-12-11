import { Context, RouterMiddleware, Router, KoaContext } from "../router";
import { Container, ContainerPool } from "../container";
import { IncomingMessage, ServerResponse, createServer } from "http";
import Koa from "koa";
import { Server } from "./server";
import { ListenResult } from "./listen-result";

export interface ApplicationOptions<TContext extends Context<TState>, TState> {

    port: number;

    hostname: string;

    prefix: string;

    facades: Function[];

    middlewares: RouterMiddleware<TContext, TState>[];

}

export abstract class Application<TContext extends Context<TState>, TState, TRouter extends Router<TContext, TState>, TServer extends Server> {

    private _server!: TServer;
    public get server(): TServer {
        return this._server;
    }

    private _router!: TRouter;
    public get router(): TRouter {
        return this._router;
    }

    private _options: ApplicationOptions<TContext, TState>;
    public get options(): ApplicationOptions<TContext, TState> {
        return this._options;
    }

    constructor(options: ApplicationOptions<TContext, TState>) {
        this._options = options;
    }

    protected abstract initializeServer(): TServer;

    protected abstract initializeRouter(server: TServer, prefix: string): TRouter;

    public start(container?: Container): Promise<ListenResult<TContext, TState, TRouter, TServer>> {
        container = container || ContainerPool.getDefaultContainer();
        if (!container) {
            throw new Error("container not specified and cannot retrieve default container");
        }
        // initialize server with app level middlewares registered
        this._server = this.initializeServer();
        // initialize router with middleware and module registered
        this._router = this.initializeRouter(this._server, this._options.prefix);
        for (const middleware of this._options.middlewares) {
            this._router.use(middleware);
        }
        for (const facade of this._options.facades) {
            container.resolve<any>(facade);
        }
        // listen
        return new Promise<ListenResult<TContext, TState, TRouter, TServer>>(resolve => {
            this._server.listen(this._options.port, this._options.hostname, () => {
                return resolve({
                    port: this._options.port,
                    server: this._server,
                    router: this._router
                });
            });
        });
    }

}
