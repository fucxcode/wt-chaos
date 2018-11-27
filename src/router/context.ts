import http, { IncomingHttpHeaders } from "http";
import * as uuid from "node-uuid";
import * as _ from "../utilities";
import { Cookies } from "./cookies";

abstract class Context<T> {

    private _oid: string;
    public get oid(): string {
        return this._oid;
    }

    private _state: T;
    public get state(): T {
        return this._state;
    }


    private _request?: http.IncomingMessage;
    public get request(): http.IncomingMessage | undefined {
        return this._request;
    }

    private _response?: http.ServerResponse;
    public get response(): http.ServerResponse | undefined {
        return this._response;
    }

    constructor(stateResolver: () => T, request?: http.IncomingMessage, response?: http.ServerResponse, oidResolver: () => string = uuid.v4) {
        this._oid = oidResolver();
        this._state = stateResolver();
        this._request = request;
        this._response = response;
    }

    public abstract get headers(): IncomingHttpHeaders;

    public abstract get query(): any;

    public abstract get params(): any;

    public abstract get body(): any;

    public abstract set body(vale: any);

    public abstract get statusCode(): number;

    public abstract set statusCode(value: number);

    public abstract get cookies(): Cookies;

    public abstract get ip(): string;

    public abstract get ips(): string[];

    public abstract get host(): string;

    public abstract get protocol(): string;

    public abstract get path(): string;

    public abstract get hostname(): string;

    public abstract get originalUrl(): string;

    public abstract json(data: any): Context<T>;

    public abstract redirect(url: string, alt?: string): void;

}

export { Context };