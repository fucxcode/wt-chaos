import http, { IncomingHttpHeaders } from "http";
import * as uuid from "node-uuid";
import * as _ from "../utilities";
import { Cookies } from "./cookies";
import { HttpMethod } from "../constants";
import { OperationContext } from "./operation-context";

export abstract class RouterContext<T extends OperationContext> {

    public abstract get operationContext(): T


    private _request?: http.IncomingMessage;
    public get request(): http.IncomingMessage | undefined {
        return this._request;
    }

    private _response?: http.ServerResponse;
    public get response(): http.ServerResponse | undefined {
        return this._response;
    }

    constructor(request?: http.IncomingMessage, response?: http.ServerResponse) {
        this._request = request;
        this._response = response;
    }

    public abstract get headers(): IncomingHttpHeaders;

    public abstract get query(): {
        [key: string]: string | string[] | undefined
    };

    public abstract get params(): {
        [key: string]: string | string[] | undefined
    };

    public abstract get requestBody(): any;

    public abstract get responseBody(): any;

    public abstract set responseBody(vale: any);

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

    public abstract json(data: any): RouterContext<T>;

    public abstract redirect(url: string, alt?: string): void;

    public abstract get method(): HttpMethod;
}
