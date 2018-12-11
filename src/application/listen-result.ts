import { Context, Router } from "../router";
import { Server } from "./server";

export interface ListenResult<TContext extends Context<TState>, TState, TRouter extends Router<TContext, TState>, TServer extends Server> {

    port: number;

    server: TServer;

    router: TRouter;

}