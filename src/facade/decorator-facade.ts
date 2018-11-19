import { Router, Context, RouterMiddleware, DEFAULT_ROUTER_KEY } from "../router";
import { getFacadeMiddlewares, getMethodMiddlewares } from "./decorator-middlewares";
import { getRoutePrefixes, getMethodRoutes } from "./decorator-route";
import * as $path from "path";
import { IContainer, getDefaultContainer } from "../container";

const facade = function <TContext extends Context<TState>, TState>(router?: Router<TContext, TState>, container?: IContainer) {
    // try resolve router from container if not specified
    let r: Router<TContext, TState>;
    if (router) {
        r = router;
    }
    else {
        const c = container || getDefaultContainer();
        if (c) {
            const ct = c;
            const rt = ct.resolve<Router<TContext, TState>>(DEFAULT_ROUTER_KEY);
            if (rt) {
                r = rt;
            }
            else {
                throw new Error("cannot find router from container when setting facade");
            }
        }
        else {
            throw new Error("cannot set facade without 'router' and default container");
        }
    }

    return function (target: any) {
        // save a reference to the original constructor
        const origin = target;
        // a utility function to generate instances of a class
        const ctor = function (constructor: any, args: any[]) {
            const c: any = function () {
                return (new Proxy(constructor, {
                    apply(target: any, thisArg: any, argumentsList: any) {
                        return new target(...argumentsList);
                    }
                }))(...args);
            };
            c.prototype = constructor.prototype;
            return new c();
        };
        // the new constructor behaviour
        const f: any = function (...args: any[]) {
            const instance = ctor(origin, args);
            // register routes for method decorated by "route" and "middleware" with incoming parameter "router"
            const prefixes = getRoutePrefixes(instance.constructor);
            const facadeMiddlewares = getFacadeMiddlewares<TContext, TState>(instance.constructor);
            const methodMiddlewares = getMethodMiddlewares<TContext, TState>(instance);
            const routes = getMethodRoutes(instance);
            routes.forEach((options, propertyKey) => {
                if (options.method) {
                    const method = options.method;
                    const path = $path.join(`/`, ...prefixes, options.path);
                    const middlewares = facadeMiddlewares.concat(methodMiddlewares.get(propertyKey) || []);
                    const handler = (instance as any)[propertyKey].bind(instance) as RouterMiddleware<TContext, TState>;
                    r.route(method, path, ...middlewares.concat(handler));
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

export { facade };