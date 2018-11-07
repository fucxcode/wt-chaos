"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_middlewares_1 = require("./decorator-middlewares");
const decorator_route_1 = require("./decorator-route");
const $path = __importStar(require("path"));
const facade = function (router) {
    // return function (target: any) {
    //     const original = target;
    //     const ctor = function (constructor: any, args: any[]) {
    //         const c: any = function () {
    //             return (new Proxy(constructor, {
    //                 apply(target: any, thisArg: any, argumentsList: any) {
    //                     return new target(...argumentsList);
    //                 }
    //             }))(...args);
    //         };
    //         c.prototype = constructor.prototype;
    //         return new c();
    //     };
    //     const f: any = function (...args: any[]) {
    //         const obj = ctor(original, args);
    //         console.log(`facade decorator`);
    //         return obj;
    //     };
    //     f.prototype = original.prototype;
    //     return f;
    // };
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
                    router.route(method, path, ...middlewares.concat(handler));
                }
                else {
                    throw new Error(`Cannot set route for ${instance.constructor.name}.${options.method} due to no method was specified.`);
                }
            });
            return instance;
        };
        f.prototype = origin.prototype;
        return f;
    };
};
exports.facade = facade;
//# sourceMappingURL=decorator-facade.js.map