import http, { ServerResponse } from "http";
import * as uuid from "node-uuid";
import { INextFunction } from "./router";
import * as _ from "../utilities";

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

    private _next?: INextFunction;
    public get next(): INextFunction {
        return this._next || Promise.resolve;
    }

    constructor(state: T, request?: http.IncomingMessage, response?: http.ServerResponse, next?: INextFunction, oidResolver: () => string = uuid.v4) {
        this._oid = oidResolver();
        this._state = state;
        this._request = request;
        this._response = response;
        this._next = next;
    }

    public abstract async json(data: any): Promise<void>;

}

export { Context };