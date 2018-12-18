import { OperationContext } from "../operation-context";
import { RouterRequest } from "./router-request";
import { RouterContext } from "../router-context";
import * as _ from "../../utilities";

export type Validator<T extends OperationContext, TRequest extends RouterRequest<T>, TValue> = (value: TValue, request: TRequest, ctx: RouterContext<T>) => Promise<void>;

export const validateRouterRequest = async function <T extends OperationContext, TRequest extends RouterRequest<T>>(request: TRequest, ctx: RouterContext<T>): Promise<void> {
    const map = Reflect.getMetadata(`wt-router-req-validators`, request) as Map<string, Validator<T, TRequest, any>[]>;
    if (map && map.size > 0) {
        for (const [key, validators] of map) {
            const value = _.get(request, key);
            for (const validator of validators) {
                await validator.call(request, value, request, ctx);
            }
        }
    }
};