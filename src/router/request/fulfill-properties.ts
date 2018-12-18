import { OperationContext } from "../operation-context";
import { RouterRequest } from "./router-request";
import { RouterContext } from "../router-context";
import * as _ from "../../utilities";

export type Resolver<T extends OperationContext> = (ctx: RouterContext<T>) => any;

export const fulfillRouterRequestProperties = function <T extends OperationContext>(request: RouterRequest<T>, ctx: RouterContext<T>): void {
    const map = Reflect.getMetadata(`wt-router-req-resolvers`, request) as Map<string, Resolver<T>>;
    if (map && map.size > 0) {
        map.forEach((resolver, key) => {
            // only set value when it's undefined
            if (_.isUndefined(_.get(request, key))) {
                const value = resolver.call(request, ctx);
                if (!_.isUndefined(value)) {
                    _.set(request, key, value);
                }
            }
        });
    }
};