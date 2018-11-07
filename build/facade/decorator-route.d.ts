import { HttpMethod } from "../constants";
declare class RouteOptions {
    private _method?;
    readonly method: string | undefined;
    private _path;
    readonly path: string;
    constructor(path: string, method?: string);
}
declare const setRoutePrefix: (target: any, path: string) => void;
declare const getRoutePrefixes: (target: any) => string[];
declare const setMethodRoute: (target: any, propertyKey: string, path: string, method?: HttpMethod | undefined) => void;
declare const getMethodRoutes: (target: any) => Map<string, RouteOptions>;
declare const route: (path: string, method?: HttpMethod | undefined) => (...args: any[]) => void;
declare const get: (path: string) => (...args: any[]) => void;
declare const post: (path: string) => (...args: any[]) => void;
declare const put: (path: string) => (...args: any[]) => void;
declare const del: (path: string) => (...args: any[]) => void;
export { route, get, post, put, del, RouteOptions, setMethodRoute, getMethodRoutes, setRoutePrefix, getRoutePrefixes };
