"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("../utilities"));
const constants_1 = require("../constants");
const METADATA_KEY_ROUTE_PREFIX = "wt-route-prefix";
const METADATA_KEY_ROUTES = "wt-routes";
class RouteOptions {
    get method() {
        return this._method;
    }
    get path() {
        return this._path;
    }
    constructor(path, method) {
        this._path = path;
        this._method = method;
    }
}
exports.RouteOptions = RouteOptions;
const setRoutePrefix = function (target, path) {
    _.updateMetadata(METADATA_KEY_ROUTE_PREFIX, path, target, () => [], (v, u) => v.concat([u]));
};
exports.setRoutePrefix = setRoutePrefix;
const getRoutePrefixes = function (target) {
    return Reflect.getMetadata(METADATA_KEY_ROUTE_PREFIX, target) || [];
};
exports.getRoutePrefixes = getRoutePrefixes;
const setMethodRoute = function (target, propertyKey, path, method) {
    _.updateMetadata(METADATA_KEY_ROUTES, new RouteOptions(path, method), target, () => new Map(), (v, u) => {
        const map = new Map(v);
        map.set(propertyKey, u);
        return map;
    });
};
exports.setMethodRoute = setMethodRoute;
const getMethodRoutes = function (target) {
    return Reflect.getMetadata(METADATA_KEY_ROUTES, target) || new Map();
};
exports.getMethodRoutes = getMethodRoutes;
const route = function (path, method) {
    return function (...args) {
        if (args.length === 1) {
            // class decorator, `method` is ignored since `path` will be the prefix of url
            setRoutePrefix(args[0], path);
        }
        else if (args.length === 3 && typeof args[2] !== "number") {
            // method decorator
            setMethodRoute(args[0], args[1], path, method);
        }
        else {
            throw new Error("route decorator only support on class and method");
        }
    };
};
exports.route = route;
const get = function (path) {
    return route(path, constants_1.HttpMethod.GET);
};
exports.get = get;
const post = function (path) {
    return route(path, constants_1.HttpMethod.POST);
};
exports.post = post;
const put = function (path) {
    return route(path, constants_1.HttpMethod.PUT);
};
exports.put = put;
const del = function (path) {
    return route(path, constants_1.HttpMethod.DELETE);
};
exports.del = del;
//# sourceMappingURL=decorator-route.js.map