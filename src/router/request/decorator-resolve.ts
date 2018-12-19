import { RouterContext } from "../router-context";
import { OperationContext } from "../operation-context";
import * as _ from "../../utilities";
import { Resolver } from "./fulfill-properties";
import { GetOption } from "../cookies";

export const resolve = function <T extends OperationContext>(resolver: Resolver<T>) {
    return function (target: any, propertyKey: string) {
        _.updateMetadata<Map<string, Resolver<T>>, Resolver<T>>(`wt-router-req-resolvers`, resolver, target, () => new Map<string, Resolver<T>>(), (v, u) => {
            const map = new Map<string, Resolver<T>>(v);
            map.set(propertyKey, u);
            return map;
        });
    };
};

export const body = function <T extends OperationContext, U, V>(path?: string, parser?: (source: U) => V) {
    return resolve<T>(ctx => {
        const source = path ? _.get(ctx.requestBody, path) : ctx.requestBody;
        return parser ? parser(source) : source;
    });
};

export const param = function <T extends OperationContext, U>(name: string, parser?: (source: string) => U) {
    return resolve<T>(ctx => {
        const source: string = _.get(ctx.params, name);
        return parser ? parser(source) : source;
    });
};

export const query = function <T extends OperationContext, U>(name: string, parser?: (source: string | string[] | undefined) => U) {
    return resolve<T>(ctx => {
        const source: string = _.get(ctx.query, name);
        return parser ? parser(source) : source;
    });
};

export const header = function <T extends OperationContext, U>(name: string, parser?: (source: string | string[] | undefined) => U) {
    return resolve<T>(ctx => {
        const source = ctx.headers[name];
        return parser ? parser(source) : source;
    });
};

export const cookie = function <T extends OperationContext, U>(name: string, parser?: (source: string | string[] | undefined) => U, opts?: GetOption) {
    return resolve<T>(ctx => {
        const source = ctx.cookies.get(name, opts);
        return parser ? parser(source) : source;
    });
};