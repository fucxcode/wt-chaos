import * as _ from "../utilities";
import { HttpMethod } from "../constants";
import { RouterRequestConstructor, RouterRequest } from "../router";
import { OperationContext } from "../router/operation-context";

const METADATA_KEY_ROUTE_PREFIX = "wt-route-prefix";
const METADATA_KEY_ROUTES = "wt-routes";

class RouteOptions<T extends OperationContext> {

    private _method?: HttpMethod;
    public get method(): HttpMethod | undefined {
        return this._method;
    }

    private _path: string;
    public get path(): string {
        return this._path;
    }

    private _RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>;
    public get RouterRequestConstructor(): RouterRequestConstructor<T, RouterRequest<T>> | undefined {
        return this._RouterRequestConstructor;
    }

    constructor(path: string, method?: HttpMethod, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
        this._path = path;
        this._method = method;
        this._RouterRequestConstructor = RouterRequestConstructor;
    }
}

const setRoutePrefix = function (target: any, path: string): void {
    _.updateMetadata<string[], string>(METADATA_KEY_ROUTE_PREFIX, path, target, () => [], (v, u) => v.concat([u]));
};

const getRoutePrefixes = function (target: any): string[] {
    return Reflect.getMetadata(METADATA_KEY_ROUTE_PREFIX, target) || [];
};

const setMethodRoute = function<T extends OperationContext> (target: any, propertyKey: string, path: string, method?: HttpMethod, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>): void {
    _.updateMetadata<Map<string, RouteOptions<T>>, RouteOptions<T>>(METADATA_KEY_ROUTES, new RouteOptions(path, method, RouterRequestConstructor), target, () => new Map<string, RouteOptions<T>>(), (v, u) => {
        const map = new Map<string, RouteOptions<T>>(v);
        map.set(propertyKey, u);
        return map;
    });
};

const getMethodRoutes = function <T extends OperationContext> (target: any): Map<string, RouteOptions<T>> {
    return Reflect.getMetadata(METADATA_KEY_ROUTES, target) || new Map<string, RouteOptions<T>>();
};

const route = function <T extends OperationContext> (path: string, method?: HttpMethod, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
    return function (...args: any[]) {
        if (args.length === 1) {
            // class decorator, `method` is ignored since `path` will be the prefix of url
            setRoutePrefix(args[0], path);
        }
        else if (args.length === 3 && typeof args[2] !== "number") {
            // method decorator
            if (method) {
                setMethodRoute(args[0], args[1], path, method, RouterRequestConstructor);
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

const get = function <T extends OperationContext> (path: string, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
    return route(path, HttpMethod.GET, RouterRequestConstructor);
};

const post = function <T extends OperationContext> (path: string, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
    return route(path, HttpMethod.POST, RouterRequestConstructor);
};

const put = function <T extends OperationContext> (path: string, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
    return route(path, HttpMethod.PUT, RouterRequestConstructor);
};

const del = function <T extends OperationContext> (path: string, RouterRequestConstructor?: RouterRequestConstructor<T, RouterRequest<T>>) {
    return route(path, HttpMethod.DELETE, RouterRequestConstructor);
};

export { route, get, post, put, del, RouteOptions, setMethodRoute, getMethodRoutes, setRoutePrefix, getRoutePrefixes };