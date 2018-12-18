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

export const body = function <T extends OperationContext>(path?: string) {
    return resolve<T>(ctx => path ? _.get(ctx.requestBody, path) : ctx.requestBody);
};

export const param = function <T extends OperationContext>(name: string) {
    return resolve<T>(ctx => _.get(ctx.params, name));
};

export const query = function <T extends OperationContext>(name: string) {
    return resolve<T>(ctx => _.get(ctx.query, name));
};

export const header = function <T extends OperationContext>(name: string) {
    return resolve<T>(ctx => _.get(ctx.headers, name));
};

export const cookie = function <T extends OperationContext>(name: string, opts?: GetOption) {
    return resolve<T>(ctx => ctx.cookies.get(name, opts));
};