import * as _ from "../utilities";
import { RouterContext, RouterMiddleware } from "../router";
import { OperationContext } from "../router/operation-context";

const METADATA_KEY_FACADE_MIDDLEWARES = "wt-facade-middlewares";
const METADATA_KEY_METHOD_MIDDLEWARES = "wt-actions-middlewares";

const setFacadeMiddlewares = function <TContext extends RouterContext<TState>, TState extends OperationContext>(target: any, middlewares: RouterMiddleware<TContext, TState>[]): void {
    _.updateMetadata<Map<Function, RouterMiddleware<TContext, TState>[]>, RouterMiddleware<TContext, TState>[]>(METADATA_KEY_FACADE_MIDDLEWARES, middlewares, target, () => new Map<Function, RouterMiddleware<TContext, TState>[]>(), (v, u) => {
        const currentMap = new Map<Function, RouterMiddleware<TContext, TState>[]>(v);
        let currentMiddlewares = currentMap.get(target);
        if (!currentMiddlewares) {
            currentMiddlewares = [];
            currentMap.set(target, currentMiddlewares);
        }
        // since the decorator invoke sequence is reversed as their definition sequence
        // (which means @decorator1 @decorator2 @decorator3 will be called as decorator3 decorator2 decorator1)
        // we use `Array.unshift` to ensure the invoke sequence should be the same as definition
        // ref: https://www.typescriptlang.org/docs/handbook/decorators.html, section "Decorator Composition"
        currentMiddlewares.unshift(...u);
        return currentMap;
    });
};

const getFacadeMiddlewares = function <TContext extends RouterContext<TState>, TState extends OperationContext>(target: any): RouterMiddleware<TContext, TState>[] {
    const middlewaresMap: Map<Function, RouterMiddleware<TContext, TState>[]> = Reflect.getMetadata(METADATA_KEY_FACADE_MIDDLEWARES, target) || new Map<Function, RouterMiddleware<TContext, TState>[]>();
    const output: RouterMiddleware<TContext, TState>[] = [];
    for (const [fn, middlewares] of middlewaresMap) {
        for (const middleware of middlewares) {
            output.push(middleware);
        }
    }
    return output;
};

const setMethodMiddlewares = function <TContext extends RouterContext<TState>, TState extends OperationContext>(target: any, propertyKey: string, middlewares: RouterMiddleware<TContext, TState>[]): void {
    _.updateMetadata<Map<string, RouterMiddleware<TContext, TState>[]>, RouterMiddleware<TContext, TState>[]>(METADATA_KEY_METHOD_MIDDLEWARES, middlewares, target, () => new Map<string, RouterMiddleware<TContext, TState>[]>(), (v, u) => {
        const currentMap = new Map<string, RouterMiddleware<TContext, TState>[]>(v);
        let currentMiddlewares = currentMap.get(propertyKey);
        if (!currentMiddlewares) {
            currentMiddlewares = [];
            currentMap.set(propertyKey, currentMiddlewares);
        }
        // since the decorator invoke sequence is reversed as their definition sequence
        // (which means @decorator1 @decorator2 @decorator3 will be called as decorator3 decorator2 decorator1)
        // we use `Array.unshift` to ensure the invoke sequence should be the same as definition
        // ref: https://www.typescriptlang.org/docs/handbook/decorators.html, section "Decorator Composition"
        currentMiddlewares.unshift(...u);
        return currentMap;
    });
};

const getMethodMiddlewares = function <TContext extends RouterContext<TState>, TState extends OperationContext>(target: any): Map<string, RouterMiddleware<TContext, TState>[]> {
    return Reflect.getMetadata(METADATA_KEY_METHOD_MIDDLEWARES, target) || new Map<string, RouterMiddleware<TContext, TState>[]>();
};

const middlewares = function <TContext extends RouterContext<TState>, TState extends OperationContext>(...middlewares: RouterMiddleware<TContext, TState>[]) {
    return function (...args: any[]): any {
        if (args.length === 1) {
            // class decorator
            setFacadeMiddlewares(args[0], middlewares);
            return args[0];
        }
        else if (args.length === 3 && typeof args[2] !== "number") {
            // method decorator
            setMethodMiddlewares(args[0], args[1], middlewares);
        }
        else {
            throw new Error("middleware decorator only support on class and method");
        }
    };
};

export { middlewares, setFacadeMiddlewares, getFacadeMiddlewares, setMethodMiddlewares, getMethodMiddlewares };