/// <reference types="node" />
import http, { IncomingHttpHeaders } from "http";
import { Cookies } from "./cookies";
declare abstract class Context<T> {
    private _oid;
    readonly oid: string;
    private _state;
    readonly state: T;
    private _request?;
    readonly request: http.IncomingMessage | undefined;
    private _response?;
    readonly response: http.ServerResponse | undefined;
    constructor(stateResolver: () => T, request?: http.IncomingMessage, response?: http.ServerResponse, oidResolver?: () => string);
    abstract readonly headers: IncomingHttpHeaders;
    abstract readonly query: any;
    abstract readonly params: any;
    abstract body: any;
    abstract statusCode: number;
    abstract readonly cookies: Cookies;
    abstract readonly ip: string;
    abstract readonly ips: string[];
    abstract readonly host: string;
    abstract readonly protocol: string;
    abstract json(data: any): Context<T>;
    abstract redirect(url: string, alt?: string): void;
}
export { Context };
