"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../router");
const decorator_middlewares_1 = require("./decorator-middlewares");
const decorator_route_1 = require("./decorator-route");
const $path = __importStar(require("path"));
const container_1 = require("../container");
const resolveRouter = function (router, container) {
    if (router) {
        return router;
    }
    else {
        const c = container || container_1.ContainerPool.getDefaultContainer();
        if (c) {
            const ct = c;
            const rt = ct.resolve(router_1.DEFAULT_ROUTER_KEY);
            if (rt) {
                return rt;
            }
            else {
                throw new Error("cannot find router from container when setting facade");
            }
        }
        else {
            throw new Error("cannot set facade without 'router' and default container");
        }
    }
};
const facade = function (router, container) {
    return function (target) {
        // save a reference to the original constructor
        const origin = target;
        // a utility function to generate instances of a class
        const ctor = function (constructor, args) {
            const c = function () {
                return (new Proxy(constructor, {
                    apply(target, thisArg, argumentsList) {
                        return new target(...argumentsList);
                    }
                }))(...args);
            };
            c.prototype = constructor.prototype;
            return new c();
        };
        // the new constructor behaviour
        const f = function (...args) {
            const instance = ctor(origin, args);
            // try resolve router from container if not specified
            const r = resolveRouter(router, container);
            // register routes for method decorated by "route" and "middleware" with incoming parameter "router"
            const prefixes = decorator_route_1.getRoutePrefixes(instance.constructor);
            const facadeMiddlewares = decorator_middlewares_1.getFacadeMiddlewares(instance.constructor);
            const methodMiddlewares = decorator_middlewares_1.getMethodMiddlewares(instance);
            const routes = decorator_route_1.getMethodRoutes(instance);
            routes.forEach((options, propertyKey) => {
                if (options.method) {
                    const method = options.method;
                    const path = $path.join(`/`, ...prefixes, options.path);
                    const middlewares = facadeMiddlewares.concat(methodMiddlewares.get(propertyKey) || []);
                    const handler = instance[propertyKey].bind(instance);
                    r.route(method, path, middlewares, handler);
                }
                else {
                    throw new Error(`Cannot set route for ${instance.constructor.name}.${options.method} due to no method was specified.`);
                }
            });
            return instance;
        };
        f.prototype = origin.prototype;
        // copy reflect metadata items to the new constructor
        for (const key of Reflect.getMetadataKeys(origin)) {
            Reflect.defineMetadata(key, Reflect.getMetadata(key, origin), f);
        }
        return f;
    };
};
exports.facade = facade;
//# sourceMappingURL=decorator-facade.js.map