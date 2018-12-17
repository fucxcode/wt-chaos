import { Router, RouterContext, RouterMiddleware, DEFAULT_ROUTER_KEY, RouterContextHandler, RouterRequestHandler } from "../router";
import { getFacadeMiddlewares, getMethodMiddlewares } from "./decorator-middlewares";
import { getRoutePrefixes, getMethodRoutes } from "./decorator-route";
import * as $path from "path";
import { Container, ContainerPool, injectable, Lifecycles } from "../container";
import { OperationContext } from "../router/operation-context";

const resolveRouter = function <TContext extends RouterContext<T>, T extends OperationContext>(router?: Router<TContext, T>, container?: Container): Router<TContext, T> {
    if (router) {
        return router;
    }
    else {
        const c = container || ContainerPool.getDefaultContainer();
        if (c) {
            const ct = c;
            const rt = ct.resolve<Router<TContext, T>>(DEFAULT_ROUTER_KEY);
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

const facade = function <TContext extends RouterContext<T>, T extends OperationContext>(router?: Router<TContext, T>, container?: Container) {
    return injectable(container, undefined, undefined, (instance: any) => {
        // try resolve router from container if not specified
        const r = resolveRouter(router, container);
        // register routes for method decorated by "route" and "middleware" with incoming parameter "router"
        const prefixes = getRoutePrefixes(instance.constructor);
        const facadeMiddlewares = getFacadeMiddlewares<TContext, T>(instance.constructor);
        const methodMiddlewares = getMethodMiddlewares<TContext, T>(instance);
        const routes = getMethodRoutes<T>(instance);
        routes.forEach((options, propertyKey) => {
            if (options.method) {
                const method = options.method;
                const path = $path.join(`/`, ...prefixes, options.path);
                const middlewares = facadeMiddlewares.concat(methodMiddlewares.get(propertyKey) || []);
                const handler = (instance as any)[propertyKey].bind(instance) as RouterContextHandler<TContext, T> | RouterRequestHandler<T>;
                const ctor = options.RouterRequestConstructor;
                r.route(method, path, middlewares, handler, ctor);
            }
            else {
                throw new Error(`Cannot set route for ${instance.constructor.name}.${options.method} due to no method was specified.`);
            }
        });
    });
};

export { facade };