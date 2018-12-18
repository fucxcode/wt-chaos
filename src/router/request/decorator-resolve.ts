import { RouterContext } from "../router-context";
import { OperationContext } from "../operation-context";
import * as _ from "../../utilities";
import { Resolver } from "./fulfill-properties";

export const resolve = function <T extends OperationContext>(resolver: Resolver<T>) {
    return function (target: any, propertyKey: string) {
        _.updateMetadata<Map<string, Resolver<T>>, Resolver<T>>(`wt-router-req-resolvers`, resolver, target, () => new Map<string, Resolver<T>>(), (v, u) => {
            const map = new Map<string, Resolver<T>>(v);
            map.set(propertyKey, u);
            return map;
        });
    };
};

