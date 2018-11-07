import { Context, RouterMiddleware } from "../router";
declare const setFacadeMiddlewares: <TContext extends Context<TState>, TState>(target: any, middlewares: RouterMiddleware<TContext, TState>[]) => void;
declare const getFacadeMiddlewares: <TContext extends Context<TState>, TState>(target: any) => RouterMiddleware<TContext, TState>[];
declare const setMethodMiddlewares: <TContext extends Context<TState>, TState>(target: any, propertyKey: string, middlewares: RouterMiddleware<TContext, TState>[]) => void;
declare const getMethodMiddlewares: <TContext extends Context<TState>, TState>(target: any) => Map<string, RouterMiddleware<TContext, TState>[]>;
declare const middlewares: <TContext extends Context<TState>, TState>(...middlewares: RouterMiddleware<TContext, TState>[]) => (...args: any[]) => any;
export { middlewares, setFacadeMiddlewares, getFacadeMiddlewares, setMethodMiddlewares, getMethodMiddlewares };
