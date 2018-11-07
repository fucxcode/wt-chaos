import * as _ from "../utilities";
import { HttpMethod } from "../constants";

const METADATA_KEY_ROUTE_PREFIX = "wt-route-prefix";
const METADATA_KEY_ROUTES = "wt-routes";

class RouteOptions {

    private _method?: HttpMethod;
    public get method(): HttpMethod | undefined {
        return this._method;
    }

    private _path: string;
    public get path(): string {
        return this._path;
    }

    constructor(path: string, method?: HttpMethod) {
        this._path = path;
        this._method = method;
    }
}

const setRoutePrefix = function (target: any, path: string): void {
    _.updateMetadata<string[], string>(METADATA_KEY_ROUTE_PREFIX, path, target, () => [], (v, u) => v.concat([u]));
};

const getRoutePrefixes = function (target: any): string[] {
    return Reflect.getMetadata(METADATA_KEY_ROUTE_PREFIX, target) || [];
};

const setMethodRoute = function (target: any, propertyKey: string, path: string, method?: HttpMethod): void {
    _.updateMetadata<Map<string, RouteOptions>, RouteOptions>(METADATA_KEY_ROUTES, new RouteOptions(path, method), target, () => new Map<string, RouteOptions>(), (v, u) => {
        const map = new Map<string, RouteOptions>(v);
        map.set(propertyKey, u);
        return map;
    });
};

const getMethodRoutes = function (target: any): Map<string, RouteOptions> {
    return Reflect.getMetadata(METADATA_KEY_ROUTES, target) || new Map<string, RouteOptions>();
};

const route = function (path: string, method?: HttpMethod) {
    return function (...args: any[]) {
        if (args.length === 1) {
            // class decorator, `method` is ignored since `path` will be the prefix of url
            setRoutePrefix(args[0], path);
        }
        else if (args.length === 3 && typeof args[2] !== "number") {
            // method decorator
            if (method) {
                setMethodRoute(args[0], args[1], path, method);
            }
            else {
                throw new Error("route decorator on method must specify 'method' parameter");
            }
        }
        else {
            throw new Error("route decorator only support on class and method");
        }
    };
};

const get = function (path: string) {
    return route(path, HttpMethod.GET);
};

const post = function (path: string) {
    return route(path, HttpMethod.POST);
};

const put = function (path: string) {
    return route(path, HttpMethod.PUT);
};

const del = function (path: string) {
    return route(path, HttpMethod.DELETE);
};

export { route, get, post, put, del, RouteOptions, setMethodRoute, getMethodRoutes, setRoutePrefix, getRoutePrefixes };