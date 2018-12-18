import { RouterContext } from "./router-context";
import { OperationContext } from "./operation-context";
import { OperationDescription } from "../repository";
import { RouterRequest } from "./request/router-request";

export interface RouterContextHandler<TContext extends RouterContext<TState>, TState extends OperationContext> {

    (ctx: TContext): Promise<any>;

}

export interface RouterRequestHandler<T extends OperationContext> {

    (request: RouterRequest<T>): Promise<any>;

}
