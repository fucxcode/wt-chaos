import { RouterContext, Router } from "../router";
import { Server } from "./server";
import { OperationContext } from "../router/operation-context";

export interface ListenResult<TContext extends RouterContext<TState>, TState extends OperationContext, TRouter extends Router<TContext, TState>, TServer extends Server> {

    port: number;

    server: TServer;

    router: TRouter;

}