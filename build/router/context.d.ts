/// <reference types="node" />
import http from "http";
import { INextFunction } from "./router";
declare abstract class Context<T> {
    private _oid;
    readonly oid: string;
    private _state;
    readonly state: T;
    private _request?;
    readonly request: http.IncomingMessage | undefined;
    private _response?;
    readonly response: http.ServerResponse | undefined;
    private _next?;
    readonly next: INextFunction;
    constructor(stateResolver: () => T, request?: http.IncomingMessage, response?: http.ServerResponse, next?: INextFunction, oidResolver?: () => string);
    abstract json(data: any): Context<T>;
}
export { Context };
